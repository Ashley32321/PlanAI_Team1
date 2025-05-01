<?php
// Initialize the session
session_start();

// Include the Google API client library
require 'vendor/autoload.php';

// Update the following variables
$google_oauth_client_id = '';
$google_oauth_client_secret = '';
$google_oauth_redirect_uri = 'http://localhost/To-DoListWebsite/google-oauth.php';

// Create the Google Client object
$client = new Google_Client();
$client->setClientId($google_oauth_client_id);
$client->setClientSecret($google_oauth_client_secret);
$client->setRedirectUri($google_oauth_redirect_uri);
$client->addScope("https://www.googleapis.com/auth/userinfo.email");
$client->addScope("https://www.googleapis.com/auth/userinfo.profile");

// If the authorization code is received
if (isset($_GET['code']) && !empty($_GET['code'])) {
    // Exchange authorization code for access token
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

    if (!isset($token['error'])) {
        $client->setAccessToken($token);
        $google_oauth = new Google_Service_Oauth2($client);
        $google_account_info = $google_oauth->userinfo->get();

        if (isset($google_account_info->email)) {
            // Authenticate the user
            session_regenerate_id(true);
            $_SESSION['google_loggedin'] = true;
            $_SESSION['google_email'] = $google_account_info->email;
            $_SESSION['google_name'] = $google_account_info->name;
            $_SESSION['google_picture'] = $google_account_info->picture;

            // Debugging Output (Remove this after testing)
            echo "Session Variables Set:<br>";
            echo "google_loggedin: " . ($_SESSION['google_loggedin'] ? 'true' : 'false') . "<br>";
            echo "google_email: " . $_SESSION['google_email'] . "<br>";
            echo "google_name: " . $_SESSION['google_name'] . "<br>";
            echo "google_picture: <img src='" . $_SESSION['google_picture'] . "' width='50'><br>";

            // Redirect to profile page
            header('Location: profile.php');
            exit;
        } else {
            exit('Could not retrieve profile information! Please try again later.');
        }
    } else {
        exit('Invalid access token! Please try again later.');
    }
}

// Redirect to Google Authentication page if no authorization code is received
$authUrl = $client->createAuthUrl();
header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
exit;
?>