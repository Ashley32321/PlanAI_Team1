<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1">
    <title>PlanAI Home</title>
    <link href="style.css" rel="stylesheet" type="text/css">
    <style>
        .title-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .title-logo h1 {
            font-size: 72px;
            margin: 0;
        }

        .logo-image {
            width: 80px; /* Adjust size if needed */
            height: auto;
        }

        body {
            margin: 0;
            padding: 8px 12px;
        }
    </style>
</head>
<body class="login-page">

<?php
    // Path to your PNG logo
    $imagePath = "LogoImg/PlanAiLogo.png"; 
?>

<div class="content home">
    <!-- Title and Logo -->
    <div class="title-logo">
        <h1>PlanAI</h1>
        <img src="<?php echo $imagePath; ?>" class="logo-image" alt="PlanAI Logo">
    </div>

    <p class="login-txt">Please login to PlanAI using the button below.</p>

    <a href="google-oauth.php" class="google-login-btn">
        <span class="icon">
            <!-- SVG icon for Google logo -->
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 488 512" width="24">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 
                123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 
                135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
        </span>
        Login with Google
    </a>
</div>

</body>
</html>
