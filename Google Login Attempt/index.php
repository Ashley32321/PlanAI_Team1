<?php
session_start();
require 'vendor/autoload.php'; // Ensure Google Client Library is installed

// Database connection
$db_conn = new PDO("mysql:host=localhost;dbname=classtodos", "root", "Rush2112", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

// Initialize Google Client
$client = new Google_Client();
$client->setClientId('998946007648-orlcfpteudvhiajo6bnv0jhvqmkbgt9t.apps.googleusercontent.com'); // Your Google Client ID
$client->setRedirectUri('http://localhost/To-DoListWebsite'); // Update with correct redirect URI

// Handle the ID token received from client
$id_token = $_POST['credential'] ?? null;

header('Content-Type: application/json'); // Set header to return JSON response

if ($id_token) {
    try {
        // Verify the ID Token using Google's client
        $payload = $client->verifyIdToken($id_token);
        
        if ($payload) {
            $google_id = $payload['sub'];   // Google User ID
            $email = $payload['email'];     // User Email
            $name = $payload['name'];       // User Name

            // Check if the user already exists in the database
            $stmt = $db_conn->prepare("SELECT * FROM user WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                // If user does not exist, insert new user into database
                $stmt = $db_conn->prepare("INSERT INTO user (user_id, username, email) VALUES (?, ?, ?)");
                $stmt->execute([$google_id, $name, $email]);
            }

            // Set the session with user email and additional user details
            $_SESSION['user'] = [
                'email' => $email,
                'name' => $name,
                'google_id' => $google_id
            ];

            // Redirect to the To-Do List page after successful login
            header("Location: todo.php"); // Update the destination to your to-do list page
            exit(); // Make sure to exit after redirect to avoid executing further code
        } else {
            // If token verification failed, return error message
            echo json_encode(['status' => 'error', 'message' => 'Invalid ID Token']);
        }
    } catch (Exception $e) {
        // If there is an exception, catch it and return the error message
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // If no ID Token is received, return error message
    echo json_encode(['status' => 'error', 'message' => 'No ID Token received']);
}
?>




