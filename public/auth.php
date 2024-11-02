<?php

if (!isset($_POST["method"])) {
    header("Location: .");
    return;
}

require("db.php");

if ($_POST["method"] == "login") {
    // echo "<h1>Login</h1>\n";
    // echo "<h3>Username: " . $_POST["username"] . "</h3>";
    // echo "<h3>Password: " . $_POST["password"] . "</h3>";
}

if ($_POST["method"] == "register") {
    // echo "<h1>Register</h1>\n";
    // echo "<h3>Username: " . $_POST["username"] . "</h3>";
    // echo "<h3>Password: " . $_POST["password"] . "</h3>";
    // echo "<h3>PasswordAgain: " . $_POST["passwordAgain"] . "</h3>";    
}

session_start();
header("Location: ./desktop.html");

?>
    <!-- <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    
        <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">
    
        <script src="js/utils.js"></script>
    </head>
    
    <body> -->
<!-- 
</body>

</html> -->