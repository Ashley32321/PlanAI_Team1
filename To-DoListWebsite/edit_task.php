<?php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['task_num'])) {
    $task_num = $_POST['task_num'];
    $task_name = trim($_POST['task_name'] ?? '');
    $task_date = trim($_POST['task_date'] ?? '');
    $task_time = trim($_POST['task_time'] ?? '');

    if (!empty($task_name) && !empty($task_date) && !empty($task_time)) {
        try {
            // Update the task in the database
            $sql = "UPDATE tasks 
                    SET task_name = :task_name, task_date = :task_date, task_time = :task_time 
                    WHERE task_num = :task_num";
            $stmt = $db_conn->prepare($sql);
            $stmt->bindParam(':task_name', $task_name);
            $stmt->bindParam(':task_date', $task_date);
            $stmt->bindParam(':task_time', $task_time);
            $stmt->bindParam(':task_num', $task_num);

            $stmt->execute();

            echo "Task updated.";
        } catch (PDOException $e) {
            echo "Database error: " . $e->getMessage();
        }
    } else {
        echo "All fields are required!";
    }
}
?>
