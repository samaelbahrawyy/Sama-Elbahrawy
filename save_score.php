<?php
header('Content-Type: application/json');
session_start();
require 'db.php';

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $player_name = trim($_POST['player_name'] ?? '');
    $score = intval($_POST['score'] ?? 0);
    $category_id = intval($_POST['category_id'] ?? 0);

    // Basic server-side validation
    if ($player_name !== '' && strlen($player_name) <= 50 && $score >= 0 && $score <= 10) {
        try {
            $stmt = $pdo->prepare("INSERT INTO scores (player_name, score, category_id) VALUES (?, ?, ?)");
            $stmt->execute([$player_name, $score, $category_id]);
            $response['success'] = true;
        } catch (Exception $e) {
            $response['error'] = 'Database error: ' . $e->getMessage();
        }
    } else {
        $response['error'] = 'Invalid input data';
    }
}

echo json_encode($response);
?>