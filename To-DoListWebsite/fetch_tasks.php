<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['google_loggedin'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['google_id'];

try {
    $stmt = $db_conn->prepare("SELECT * FROM tasks WHERE user_id = :user_id ORDER BY task_date ASC, task_time ASC");
    $stmt->execute(['user_id' => $user_id]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($tasks);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
