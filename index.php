<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MINDSPARK! - Quiz Challenge</title>
  
  <!-- CSS Stylesheet -->
  <link rel="stylesheet" href="quizweb.css" />
  
  <!-- jQuery Core Library (Required) -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
  <!-- jQuery UI for Effects (shake, pulsate, etc.) -->
  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
</head>
<body>

  <!-- ====================== LOGIN SCREEN (First screen user sees) ====================== -->
  <div id="login-screen" class="container">
    <div class="login-card">
      <h1>
        <span class="title-main">MINDSPARK!</span>
      </h1>

      <p class="login-subtitle">Enter your name to begin the challenge</p>

      <!-- Name Input Box with Validation -->
      <input 
        type="text" 
        id="loginName" 
        placeholder="Your name..." 
        maxlength="20" 
        autocomplete="off"
        class="name-input"
      />
      <!-- Validation message will appear here dynamically via jQuery -->

      <button id="loginBtn" class="start-btn">Start Playing</button>

      <small>Press Enter or click the button to continue</small>
    </div>
  </div>

  <!-- ====================== MAIN GAME (Hidden until login) ====================== -->
  <div id="main-container" class="container" style="display:none;">

    <!-- Category Selection Screen -->
    <div id="category-screen">
      <h1 class="game-title">MINDSPARK!</h1>
      
      <h3 class="welcome-msg">Hello, <span id="playerName" class="player-highlight"></span>! 👋</h3>
      
      <div class="name-change-section">
        <label for="userName" class="form-label">Want to change your name?</label>
        <input 
          type="text" 
          id="userName" 
          placeholder="Enter new name (optional)" 
          maxlength="20"
          autocomplete="off"
          class="name-change-input"
        />
        <!-- Validation message for name change will appear here -->
      </div>

      <div class="category-section">
        <p class="category-label">Choose a category to get started:</p>
        <select id="category" class="category-select">
          <option value="">Loading categories...</option>
        </select>
      </div>

      <button id="start-btn" class="start-btn">Start Quiz 🚀</button>
    </div>

    <!-- Quiz Screen (Hidden until quiz starts) -->
    <div id="quiz-screen" style="display:none;">
      <!-- Timer Display -->
      <div class="timer" id="timer">30</div>
      
      <!-- Progress Bar -->
      <div class="progress">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      
      <!-- Question Text -->
      <div class="question" id="question">Loading question...</div>
      
      <!-- Answer Options -->
      <div class="options" id="options">
        <!-- Answer buttons will be generated here by jQuery -->
      </div>
      
      <!-- Question Counter -->
      <p class="question-counter">
        Question <span id="currentQ">1</span> of <span id="totalQ">10</span>
      </p>
    </div>
  </div>

  <!-- ====================== RESULT SCREEN (Shown after quiz completion) ====================== -->
  <div id="result-screen" class="container" style="display:none;">
    <div class="result-content">
      <h1 class="result-title">🎉 Well Done, Champion! 🎉</h1>
      
      <div class="score-display">
        <p class="player-score">
          <strong id="finalName" class="final-player-name"></strong>, your score:
        </p>
        <p class="score-value">
          <strong id="score">0</strong> / 10
        </p>
      </div>

      <!-- Score save message will appear here via jQuery -->

      <div class="result-buttons">
        <button onclick="location.reload()" class="start-btn play-again-btn">
          🔄 Play Again
        </button>
        
        <button onclick="window.location='highscores.php'" class="start-btn highscore-btn">
          🏆 View Highscores
        </button>
      </div>
    </div>
  </div>

  <!-- JavaScript File (Load at end for better performance) -->
  <script src="quizweb.js"></script>
</body>
</html>