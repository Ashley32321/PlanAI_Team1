<?php
session_start();

if (!isset($_SESSION['google_loggedin'])) {
    header('Location: login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendar - PlanAI To-Do List</title>
    
    <!-- FullCalendar CSS (if using CDN) -->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/main.min.css" rel="stylesheet">


    <!-- Link to your custom calendar CSS (e.g., calendar.css) -->
    <link rel="stylesheet" href="calendar_style.css">

    <!-- General Styles (already linked) -->
    <link rel="stylesheet" href="style.css">

    <!-- FullCalendar JS -->
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js" defer></script>
</head>
<body>
    <!-- FullCalendar -->
    <div id="calendar"></div>

    <!-- Back to Home Button -->
    <a href="profile.php" class="back-btn">← Back to Home</a>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const calendarEl = document.getElementById('calendar');

            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: 'calendar_fetch_tasks.php', 
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                }
            });

            calendar.render();
        });
    </script>
</body>
</html>
