<?php
require_once 'db.php';

echo "Database connection successful! 🎉<br><br>";

try {
    $stmt = $pdo->query("SHOW TABLES");
    echo "Tables in your database:<br>";
    while ($row = $stmt->fetch()) {
        echo "- " . $row[0] . "<br>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>