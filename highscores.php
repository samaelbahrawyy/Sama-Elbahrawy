<?php
require 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MINDSPARK! - Highscores</title>
    <link rel="stylesheet" href="quizweb.css">
    <style>
        body { background: linear-gradient(135deg, #ff9aed, #c689ff); }
        table { 
            width: 90%; 
            max-width: 800px; 
            margin: 40px auto; 
            border-collapse: collapse; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.25); 
        }
        th { 
            background: #b05ad8; 
            color: white; 
            padding: 20px; 
            font-size: 1.5rem; 
        }
        td { 
            padding: 15px; 
            text-align: center; 
            font-size: 1.2rem; 
        }
        tr:nth-child(even) { background: #f0e0ff; }
        .rank { font-weight: bold; font-size: 1.4rem; color: #b05ad8; }
        .back-btn { display: block; margin: 20px auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title-main">MINDSPARK! Highscores</h1>
        <p style="font-size:1.4rem; margin:20px;">Top Players 🏆</p>

        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player Name</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php
                try {
                    $stmt = $pdo->query("SELECT player_name, score, played_at FROM scores ORDER BY score DESC, played_at DESC LIMIT 20");
                    $rank = 1;
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $date = date('d/m/Y H:i', strtotime($row['played_at']));
                        echo "<tr>
                            <td class='rank'>#$rank</td>
                            <td>" . htmlspecialchars($row['player_name']) . "</td>
                            <td><strong>{$row['score']}/10</strong></td>
                            <td>$date</td>
                        </tr>";
                        $rank++;
                    }
                    if ($rank === 1) {
                        echo "<tr><td colspan='4'>No scores yet. Be the first!</td></tr>";
                    }
                } catch (Exception $e) {
                    echo "<tr><td colspan='4' style='color:red;'>Error: " . htmlspecialchars($e->getMessage()) . "</td></tr>";
                }
                ?>
            </tbody>
        </table>

        <button onclick="location.href='index.php'" class="start-btn back-btn">Back to Game</button>
    </div>
</body>
</html>