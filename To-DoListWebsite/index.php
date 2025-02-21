<?php
// Database connection using PDO
$strConn = "mysql:host=localhost;port=3306;dbname=classtodos";
$strUser = 'root';  // Your MySQL username
$strPWord = ''; // Your MySQL password

try {
  $db_conn = new PDO($strConn, $strUser, $strPWord);
  // set the PDO error mode to exception
  $db_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  echo "Connected successfully";
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
if (! isset($strSearchTerm)){
  $strSearchTerm = 'Weather in MO';
}
if (isset($_GET['SearchTerm'])){
  $strToSearchOnGoogle = $_GET['SearchTerm'];
} else {
  $strToSearchOnGoogle = 'Weather in MO';
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>To-Do List</h1>

        <!-- Task input form -->
        <form id="task-form">
            <input type="text" id="task-input" placeholder="Add a new task..." required>
            <select id="day-select"></select>
            <input type="time" id="task-time" required>
            <button type="submit">Add Task</button>
        </form>

        <!-- Search bar -->
        <input type="text" id="search-bar" placeholder="Search tasks...">

        <!-- Task list -->
        <ul id="task-list"></ul>
    </div>

    <script src="script.js"></script>
</body>
</html>

