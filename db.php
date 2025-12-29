<?php
$host = 'localhost';
$dbname = 'mindspark_quiz';  // Make sure this matches the database name you created in phpMyAdmin
$username = 'root';
$password = '';  // Usually empty in XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("set names utf8mb4");
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>