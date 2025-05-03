<?php
ini_set('display_errors', 0); 
ini_set('log_errors', 1); 
error_log('errors.log'); 

require 'db_connect.php';

header("Content-Type: application/json");

try {
    // Execute query to fetch tasks by task_date and task_time
    $stmt = $db_conn->query("SELECT * FROM tasks ORDER BY task_date, task_time ASC");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If there are no tasks, return an empty array
    if (empty($tasks)) {
        echo json_encode([], JSON_PRETTY_PRINT); // No tasks found
    } else {
        // Format tasks into FullCalendar-compatible events
        $events = [];
        foreach ($tasks as $task) {
            $start = $task['task_date'] . 'T' . $task['task_time'];

            
            $events[] = [
                'title' => $task['task_name'], 
                'start' => $start, 
            ];
        }

        // Return tasks as a JSON response
        echo json_encode($events, JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    // If there's a database error, return the error message as JSON
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
