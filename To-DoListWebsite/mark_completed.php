<?php
require 'db_connect.php';

if (isset($_GET['task_num']) && isset($_GET['status'])) {
    $task_num = $_GET['task_num'];
    $status = $_GET['status'];

    try {
        // Update the task status based on the passed parameter
        $sql = "UPDATE tasks SET status = :status WHERE task_num = :task_num";
        $stmt = $db_conn->prepare($sql);
        $stmt->bindParam(':task_num', $task_num);
        $stmt->bindParam(':status', $status);
        $stmt->execute();

        echo "Task status updated.";
    } catch (PDOException $e) {
        echo "Database error: " . $e->getMessage();
    }
}
?>
