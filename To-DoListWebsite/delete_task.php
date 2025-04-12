<?php
require 'db_connect.php';

if (isset($_GET['task_num'])) {
    $task_num = $_GET['task_num'];

    try {
        $stmt = $db_conn->prepare("DELETE FROM tasks WHERE task_num = :task_num");
        $stmt->bindParam(':task_num', $task_num);
        $stmt->execute();
        echo "Task deleted.";
    } catch (PDOException $e) {
        echo "Database error: " . $e->getMessage();
    }
}
?>
