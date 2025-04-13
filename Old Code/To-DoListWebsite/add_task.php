<?php
session_start();
require 'db_connect.php'; // Ensure this file correctly connects to your database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task_name = trim($_POST['task_name'] ?? '');
    $task_date = trim($_POST['task_date'] ?? '');
    $task_time = trim($_POST['task_time'] ?? '');

    if (!empty($task_name) && !empty($task_date) && !empty($task_time)) {
        try {
            // Insert task without user_id
            $sql = "INSERT INTO tasks (task_name, task_date, task_time, status) 
                    VALUES (:task_name, :task_date, :task_time, 'Pending')";
            $stmt = $db_conn->prepare($sql);
            $stmt->bindParam(':task_name', $task_name);
            $stmt->bindParam(':task_date', $task_date);
            $stmt->bindParam(':task_time', $task_time);
            $stmt->execute();
            
            // Redirect back to profile.php after successful submission
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
