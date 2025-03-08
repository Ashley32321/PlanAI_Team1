<?php
// Database connection settings
$host = 'localhost';
$dbname = 'classtodos';
$username = 'root';
$password = 'Rush2112';

try {
    // Establish a connection to the database
    $db_conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Google Login handling
if (isset($_POST['credential'])) {
    $idToken = $_POST['credential'];
    error_log("ID Token received: $idToken");

    // Here you should validate the token using Google's API.
    // For example: validate the token via Google's OAuth2.0 token verification endpoint.
    // If validated, proceed to fetch user information and possibly store it in a session or database.
}

// Handling task operations (Add, Edit, Delete)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['task']) && isset($_POST['day']) && isset($_POST['time'])) {
        $task = $_POST['task'];
        $day = $_POST['day'];
        $time = $_POST['time'];

        $stmt = $db_conn->prepare("INSERT INTO tasks (task_text, task_day, task_time) VALUES (:task, :day, :time)");
        $stmt->bindParam(':task', $task);
        $stmt->bindParam(':day', $day);
        $stmt->bindParam(':time', $time);

        if ($stmt->execute()) {
            echo "Task added successfully!";
        } else {
            echo "Failed to add task.";
        }
    }
}

// Fetch tasks from the database


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link rel="stylesheet" type="text/css" href="path/to/style.css">
</head>
<body>
    <h1>Todo List</h1>

    <!-- Google Login Button -->
    <div id="g-signin2" class="g-signin2"></div>

    <!-- Task Form -->
    <form id="task-form" method="POST">
        <input type="text" id="task-input" name="task" placeholder="Enter your task" required>
        <select id="day-select" name="day" required></select>
        <input type="time" id="task-time" name="time" required>
        <button type="submit">Add Task</button>
    </form>

    <!-- Task List -->
    <ul id="task-list">
        <?php foreach ($tasks as $task): ?>
            <li data-id="<?= $task['id'] ?>" data-date="<?= $task['task_day'] ?>" data-time="<?= $task['task_time'] ?>">
                <span class="task-text"><?= htmlspecialchars($task['task_text']) ?> - <?= $task['task_day'] ?> @ <?= $task['task_time'] ?></span>
                <div class="task-actions">
                    <button class="edit-btn">✎ Edit</button>
                    <button class="complete-btn">✔ Complete</button>
                    <button class="delete-btn">✖ Delete</button>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>

    <!-- Scripts -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script src="task.js"></script>  <!-- Assuming your JavaScript file is task.js -->
</body>
</html>
