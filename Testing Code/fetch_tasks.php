<?php
require 'db_connect.php';

header("Content-Type: application/json");

try {
    $stmt = $db_conn->query("SELECT * FROM tasks ORDER BY task_date, task_time ASC");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //  Ensure JSON is valid
    echo json_encode($tasks, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    // ❌ Return a JSON error instead of raw text
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
