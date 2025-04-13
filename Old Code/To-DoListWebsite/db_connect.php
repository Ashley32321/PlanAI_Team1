<?php
$host = 'localhost';
$dbname = 'classtodos';
$username = 'root';
$password = ''; // Change if using a different password

try {
    $db_conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
