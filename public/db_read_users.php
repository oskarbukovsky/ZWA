<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing</title>

    <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">

    <script src="js/classes.js"></script>

    <?php
    require("db.php");
    getData("user","users", "username,uuid,icon,settings");
        ?>
</head>

<body>
    <?php
    getDataVisual("users","users", "*");
    ?>

    <?php
    $conn = null;
    ?>
</body>

</html>