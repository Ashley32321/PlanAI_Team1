<?php
// mark_completed.php
require 'db_connect.php';

if (isset($_GET['task_num']) && isset($_GET['status'])) {
    $taskNum = $_GET['task_num'];
    $status = $_GET['status'];

    // Ensure the status is valid (either "Completed" or "Not Completed")
    if ($status === "Completed" || $status === "Not Completed") {
        $query = "UPDATE tasks SET status = ? WHERE task_num = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$status, $taskNum]);

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid status']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
}
?>
