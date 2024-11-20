<?php
require("db.php");
if (!sessionIsValid()) {
    header("Location: error.php?code=403");
    die();
}
?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Administrace</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/administration/administration.css">

    <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">
    <meta name="author" content="Jan Oskar Bukovský">
    <meta name="description" content="ZWA project">
    <meta name="Content-Type" content="text/html">

    <script src="js/classes.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/setup.js"></script>
    <script src="js/administration.js"></script>
</head>

<body>
</body>

</html>