<?php
require("db.php");
if (sessionIsValid()) {
    header("Location: desktop.php");
    die();
}
?>
<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Přihlášení</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/login/login.css">

    <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">
    <meta name="author" content="Jan Oskar Bukovský">
    <meta name="description" content="ZWA project">
    <meta name="Content-Type" content="text/html">

    <script src="js/utils.js"></script>
    <script src="js/login.js"></script>

    <link rel="prefetch" href="media/login/bloom.mp4">
    <link rel="prefetch" href="desktop.php">
    <link rel="preconnect" href="https://peapix.com">
    <link rel="preconnect" href="https://img.peapix.com">
</head>

<!-- Target Chromium based browsers version: 85+ -->

<body>
    <video id="loginAnimation" class="hidden">
        <source src="media/login/bloom.mp4" type="video/mp4">
    </video>
    <div id="authForms">
        <div class="user-icon">
            <img src="media/login/user-icon.webp" alt="Default User Icon">
        </div>
        <form action="auth.php" method="post" id="loginForm">
            <input type="text" name="method" value="login" class="hidden">
            <div class="input">
                <label for="loginUsername">
                    <input id="loginUsername" type="text" name="username" placeholder="Jméno" pattern="[a-zA-Z0-9]{5,16}"
                    autocomplete="username" title="Jméno musí mít 5-16 znaků, a smí být složeno pouze z a-z, A-Z, 0-9"
                    required
                    <?php
                    if (isset($_COOKIE["Prefill-username"]) && isset($_GET["type"]) && $_GET["type"] == "login") {
                        echo "value=\"" . htmlspecialchars($_COOKIE["Prefill-username"]) . "\"";
                    }
                    ?>>
                </label>
            </div>
            <div class="input">
                <label for="loginPassword">
                    <input id="loginPassword" type="password" name="password" placeholder="Heslo"
                    autocomplete="current-password" pattern=".{6,}" title="Heslo musí obsahovat 6 a více znaků"
                    required>
                </label>
            </div>
            <label class="loginButton" for="loginSubmit">
                <input id="loginSubmit" type="submit" value="Submit">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                </svg>
            </label>
        </form>
        <form action="auth.php" method="post" id="registerForm" autocomplete="off">
            <input type="text" name="method" value="register" class="hidden">
            <div class="input">
                <label for="registerUsername">
                    <input id="registerUsername" type="text" name="username" placeholder="Jméno" autocomplete="username"
                    pattern="[a-zA-Z0-9]{5,16}"
                    title="Jméno musí mít 5-16 znaků, a smí být složeno pouze z a-z, A-Z, 0-9" required <?php
                    if (isset($_COOKIE["Prefill-username"]) && isset($_GET["type"]) && $_GET["type"] == "register") {
                        echo "value=" . htmlspecialchars($_COOKIE["Prefill-username"]);
                    }
                    ?>>
                </label>
            </div>
            <div class="input">
                <label for="registerPassword">
                    <input id="registerPassword" type="password" name="password" placeholder="Heslo"
                        autocomplete="new-password" pattern=".{6,}" title="Heslo musí obsahovat 6 a více znaků"
                        required>
                </label>
            </div>
            <div class="input">
                <label for="registerPasswordAgain">
                    <input id="registerPasswordAgain" type="password" name="passwordAgain" placeholder="Heslo znovu"
                    autocomplete="new-password" pattern=".{6,}" title="Heslo musí obsahovat 6 a více znaků" required>
                </label>
            </div>
            <label class="loginButton" for="registerSubmit">
                <input id="registerSubmit" type="submit" value="Submit">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                </svg>
            </label>
        </form>

        <label for="toggle-login-register">
            <?php
            if (isset($_GET["type"]) && $_GET["type"] == "register") {
                echo '<input type="checkbox" id="toggle-login-register" aria-hidden="true"checked>';
            } else {
                echo '<input type="checkbox" id="toggle-login-register" aria-hidden="true">';
            }
            ?>
        </label>

    </div>
</body>

</html>