<?php
// Disable direct error output, but log it to a file
ini_set('display_errors', 0); // Don't show errors in the response
ini_set('log_errors', 1); // Log errors to a file
error_log('errors.log'); // Set log file

require 'db_connect.php';

header("Content-Type: application/json");

try {
    // Execute query to fetch tasks ordered by task_date and task_time
    $stmt = $db_conn->query("SELECT * FROM tasks ORDER BY task_date, task_time ASC");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If there are no tasks, return an empty array
    if (empty($tasks)) {
        echo json_encode([], JSON_PRETTY_PRINT); // No tasks found
    } else {
        // Format tasks into FullCalendar-compatible events
        $events = [];
        foreach ($tasks as $task) {
            // Combine task date and time into an ISO 8601 formatted string
            $start = $task['task_date'] . 'T' . $task['task_time'];

            // Optional: You can add an end time or other task fields
            // Example: Calculating an end time (if needed)
            // $end = (new DateTime($start))->modify('+1 hour')->format('Y-m-d\TH:i:s');

            $events[] = [
                'title' => $task['task_name'], // Task title
                'start' => $start, // Start time
                // 'end' => $end, // End time (if applicable)
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
