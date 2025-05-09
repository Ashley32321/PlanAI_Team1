<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['google_loggedin'])) {
    header('Location: login.php');
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task_name = trim($_POST['task_name'] ?? '');
    $task_date = trim($_POST['task_date'] ?? '');
    $task_time = trim($_POST['task_time'] ?? '');

    $user_id = $_SESSION['google_id'];

    if (!empty($task_name) && !empty($task_date) && !empty($task_time)) {
        try {
            $sql = "INSERT INTO tasks (task_name, task_date, task_time, user_id, status) 
                    VALUES (:task_name, :task_date, :task_time, :user_id, 'Pending')";
            $stmt = $db_conn->prepare($sql);
            $stmt->bindParam(':task_name', $task_name);
            $stmt->bindParam(':task_date', $task_date);
            $stmt->bindParam(':task_time', $task_time);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            header("Location: profile.php");
            exit;
        } catch (PDOException $e) {
            echo "Database error: " . $e->getMessage();
        }
    } else {
        echo "All fields are required!";
    }
}
?>
