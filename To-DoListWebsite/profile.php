<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['google_loggedin'])) {
    header('Location: login.php');
    exit;
}

$google_email = $_SESSION['google_email'];
$google_name = $_SESSION['google_name'];
$google_picture = $_SESSION['google_picture'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlanAI To-Do List</title>
    <link rel="stylesheet" type="text/css" href="style.css">

    <!-- Google Sign-In -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>

    <!-- Logout Button -->
    <a href="logout.php" class="logout-btn">
        <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="..."/>
            </svg>
        </span>
        Logout
    </a>

    <!-- Theme Toggle -->
    <button id="theme-toggle" class="theme-toggle">Toggle Theme</button>

    <div class="content home">
        <!-- Google Profile Section -->
        <div class="profile-picture">
            <img src="<?=$google_picture?>" alt="<?=$google_name?>" width="100" height="100">
        </div>

        <div class="profile-details">
            <div class="name">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="..."/>
                    </svg>
                </div>
                <div class="wrap"><strong>Name: </strong><span><?=$google_name?></span></div>
            </div>

            <div class="email">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="..."/>
                    </svg>
                </div>
                <div class="wrap"><strong>Email: </strong><span><?=$google_email?></span></div>
            </div>
        </div>
    </div>

    <!-- To-Do List Section -->
    <div class="container">
        <h1>To-Do List</h1>

        <!-- Task input form -->
        <form id="task-form">
            <label for="task-input">Task Name:</label>
            <input type="text" id="task-input" name="task_name" required>

            <label for="task-date">Task Date:</label>
            <input
                type="date"
                id="task-date"
                name="task_date"
                style="
                    width: 60%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 2px solid var(--border-color);
                    border-radius: 6px;
                    background-color: var(--button-bg);
                    color: var(--text-color);
                    box-shadow: inset -1px -5px 20px var(--shadow-color);
                    text-shadow: 2px 2px 8px var(--shadow-color);
                    font-size: 16px;
                "
            >

            <label for="task-time">Task Time:</label>
            <input type="time" id="task-time" name="task_time" required>

            <button type="submit" id="task-form-btn">Confirm</button>
        </form>


        <!-- Search bar -->
       <!-- <input type="text" id="search-bar" placeholder="Search tasks..."> -->

        <!-- Task list -->
        <ul id="task-list"></ul>
    </div>

    <!-- JavaScript -->
    <script src="tasks.js" defer></script>
</body>
</html>
