// ====================== JQUERY READY EVENT ======================
$(document).ready(function() {
  // Load categories when page loads
  loadCategories();
  
  // Attach event handlers using jQuery
  $('#loginBtn').on('click', handleLogin);
  $('#start-btn').on('click', handleStartQuiz);
  
  // Real-time name validation
  $('#loginName').on('input', validateNameInput);
  $('#userName').on('input', validateNameInputChange);
  
  // Allow Enter key to submit login
  $('#loginName').on('keypress', function(e) {
    if (e.which === 13) { // Enter key
      $('#loginBtn').trigger('click');
    }
  });
});

// ====================== GLOBAL VARIABLES ======================
let playerName = "";
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;

// ====================== REAL-TIME VALIDATION WITH REGEX ======================
function validateNameInput() {
  const name = $(this).val().trim();
  const nameRegex = /^[a-zA-Z\s]{2,20}$/;
  
  // Remove any existing validation message
  $('#validation-msg').remove();
  
  // Don't show message if input is empty
  if (name.length === 0) {
    $('#loginBtn').prop('disabled', false).css('opacity', '1');
    return;
  }
  
  // Check if name matches regex pattern
  if (!nameRegex.test(name)) {
    // Invalid - show error message
    $('<p></p>')
      .attr('id', 'validation-msg')
      .css({
        color: '#e53e3e',
        fontSize: '0.95rem',
        marginTop: '10px',
        fontWeight: '500'
      })
      .text('⚠ Name must be 2-20 letters only (no numbers or special characters)')
      .insertAfter('#loginName')
      .hide()
      .fadeIn(300);
    
    $('#loginBtn').prop('disabled', true).css('opacity', '0.5');
  } else {
    // Valid - show success message
    $('<p></p>')
      .attr('id', 'validation-msg')
      .css({
        color: '#48bb78',
        fontSize: '0.95rem',
        marginTop: '10px',
        fontWeight: '500'
      })
      .text('✓ Valid name - Ready to play!')
      .insertAfter('#loginName')
      .hide()
      .fadeIn(300);
    
    $('#loginBtn').prop('disabled', false).css('opacity', '1');
  }
}

// Validation for name change in category screen
function validateNameInputChange() {
  const name = $(this).val().trim();
  const nameRegex = /^[a-zA-Z\s]{2,20}$/;
  
  $('#name-change-msg').remove();
  
  if (name.length === 0) {
    return;
  }
  
  if (!nameRegex.test(name)) {
    $('<p></p>')
      .attr('id', 'name-change-msg')
      .css({
        color: '#e53e3e',
        fontSize: '0.9rem',
        marginTop: '5px'
      })
      .text('⚠ Invalid format')
      .insertAfter('#userName')
      .hide()
      .fadeIn(300);
  } else {
    $('<p></p>')
      .attr('id', 'name-change-msg')
      .css({
        color: '#48bb78',
        fontSize: '0.9rem',
        marginTop: '5px'
      })
      .text('✓ Valid')
      .insertAfter('#userName')
      .hide()
      .fadeIn(300);
  }
}

// ====================== LOGIN HANDLER WITH JQUERY ======================
function handleLogin() {
  const name = $('#loginName').val().trim();
  const nameRegex = /^[a-zA-Z\s]{2,20}$/;
  
  // Validate name format
  if (name.length < 2) {
    alert("Please enter your name (at least 2 characters)!");
    $('#loginName').focus().effect('shake', { times: 3, distance: 5 }, 400);
    return;
  }
  
  if (!nameRegex.test(name)) {
    alert("Name must contain only letters (2-20 characters)!");
    $('#loginName').focus().effect('shake', { times: 3, distance: 5 }, 400);
    return;
  }
  
  // Set player name
  playerName = name;
  
  // Update all name displays using jQuery
  $('#playerName').text(playerName);
  $('#finalName').text(playerName);
  
  // Smooth transition between screens
  $('#login-screen').fadeOut(400, function() {
    $('#main-container').fadeIn(400);
  });
}

// ====================== LOAD CATEGORIES WITH JQUERY ======================
async function loadCategories() {
  try {
    const res = await fetch('https://opentdb.com/api_category.php');
    const data = await res.json();
    
    // Clear existing options first
    $('#category').empty();
    
    // Add default option
    $('#category').append(
      $('<option></option>')
        .val('')
        .text('-- Select a Category --')
    );
    
    // Use jQuery .each() to iterate and append options
    $.each(data.trivia_categories, function(index, cat) {
      $('#category').append(
        $('<option></option>')
          .val(cat.id)
          .text(cat.name)
      );
    });
    
  } catch (err) {
    console.error('Error loading categories:', err);
    $('#category').html('<option>Error loading categories - Please refresh</option>');
  }
}

// ====================== START QUIZ WITH JQUERY ======================
async function handleStartQuiz() {
  const category = $('#category').val();
  
  // Validate category selection
  if (!category) {
    alert("Please choose a category!");
    $('#category').focus();
    return;
  }

  // Check if user wants to change name
  const newName = $('#userName').val().trim();
  if (newName) {
    const nameRegex = /^[a-zA-Z\s]{2,20}$/;
    
    if (!nameRegex.test(newName)) {
      alert("Invalid name format! Name must be 2-20 letters only.");
      $('#userName').focus().effect('shake', { times: 3, distance: 5 }, 400);
      return;
    }
    
    // Update player name
    playerName = newName;
    $('#playerName, #finalName').text(playerName);
  }

  try {
    // Fetch questions from API
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
    const data = await res.json();
    
    if (data.response_code !== 0) {
      alert("Failed to load questions. Please try again!");
      return;
    }
    
    questions = data.results;

    // Shuffle answers for each question
    questions.forEach(q => {
      q.all_answers = [...q.incorrect_answers, q.correct_answer];
      q.all_answers.sort(() => Math.random() - 0.5);
    });

    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    
    // Smooth transition to quiz screen using jQuery
    $('#category-screen').fadeOut(300, function() {
      $('#quiz-screen').fadeIn(300);
      showQuestion();
    });
    
  } catch (err) {
    console.error('Error fetching questions:', err);
    alert("Network error! Please check your connection and try again.");
  }
}

// ====================== SHOW QUESTION WITH JQUERY ======================
function showQuestion() {
  // Check if quiz is complete
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  const q = questions[currentQuestionIndex];
  
  // Update question text using jQuery
  $('#question').html(q.question);
  $('#currentQ').text(currentQuestionIndex + 1);
  $('#totalQ').text(questions.length);

  // Clear previous answers and create new buttons
  const $optionsDiv = $('#options');
  $optionsDiv.empty();
  
  // Use jQuery .each() to create answer buttons
  $.each(q.all_answers, function(index, ans) {
    const $btn = $('<button></button>')
      .html(ans)
      .on('click', function() {
        selectAnswer(ans, this);
      });
    
    $optionsDiv.append($btn);
  });

  // Animate progress bar with jQuery
  const progress = ((currentQuestionIndex / questions.length) * 100);
  $('#progressBar').stop().animate({ 
    width: progress + '%' 
  }, 400, 'swing');

  // Start countdown timer
  timeLeft = 30;
  $('#timer').text(timeLeft).css('color', '#e53e3e');
  
  clearInterval(timerInterval);
  
  timerInterval = setInterval(function() {
    timeLeft--;
    $('#timer').text(timeLeft);
    
    // Change color when time is running out
    if (timeLeft <= 10) {
      $('#timer').css('color', '#c53030');
    }
    if (timeLeft <= 5) {
      $('#timer').effect('pulsate', { times: 1 }, 500);
    }
    
    // Time's up
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer(null);
    }
  }, 1000);
}

// ====================== SELECT ANSWER WITH JQUERY ======================
function selectAnswer(selected, btn) {
  clearInterval(timerInterval);
  const correct = questions[currentQuestionIndex].correct_answer;
  
  // Disable all buttons using jQuery
  $('#options button').prop('disabled', true);

  if (selected === correct) {
    // Correct answer
    score++;
    
    if (btn) {
      $(btn)
        .addClass('correct')
        .css('transform', 'scale(1.05)')
        .animate({ opacity: 1 }, 200);
    }
  } else {
    // Wrong answer
    if (btn) {
      $(btn)
        .addClass('wrong')
        .effect('shake', { times: 2, distance: 8 }, 400);
    }
    
    // Highlight the correct answer using jQuery
    $('#options button').each(function() {
      if ($(this).html() === correct) {
        $(this)
          .addClass('correct')
          .css('transform', 'scale(1.05)')
          .fadeIn(300);
      }
    });
  }

  // Move to next question after delay
  setTimeout(function() {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
}

// ====================== END QUIZ WITH JQUERY ======================
function endQuiz() {
  // Hide quiz screen and show result with smooth transition
  $('#main-container').fadeOut(400, function() {
    $('#result-screen').fadeIn(400);
  });
  
  // Update final score
  $('#score').text(score);
  $('#finalName').text(playerName);

  // Save score to database using jQuery AJAX
  $.ajax({
    url: 'save_score.php',
    method: 'POST',
    data: {
      player_name: playerName,
      score: score,
      category_id: $('#category').val()
    },
    dataType: 'json',
    
    success: function(data) {
      if (data.success) {
        console.log("✓ Score saved successfully to database!");
        
        // Show success message with jQuery animation
        $('<p></p>')
          .attr('id', 'save-success-msg')
          .css({
            color: '#48bb78',
            fontSize: '1.1rem',
            marginTop: '20px',
            fontWeight: '500'
          })
          .text('✓ Your score has been saved to the leaderboard!')
          .appendTo('#result-screen')
          .hide()
          .fadeIn(600);
          
      } else {
        console.error("❌ Save failed:", data.message || data.error);
        
        // Show error message
        $('<p></p>')
          .css({
            color: '#e53e3e',
            fontSize: '1rem',
            marginTop: '20px'
          })
          .text('⚠ Could not save score. Please try again.')
          .appendTo('#result-screen')
          .hide()
          .fadeIn(600);
      }
    },
    
    error: function(xhr, status, error) {
      console.error("❌ AJAX Error:", status, error);
      
      // Show error message
      $('<p></p>')
        .css({
          color: '#e53e3e',
          fontSize: '1rem',
          marginTop: '20px'
        })
        .text('⚠ Network error. Score not saved.')
        .appendTo('#result-screen')
        .hide()
        .fadeIn(600);
    }
  });
}