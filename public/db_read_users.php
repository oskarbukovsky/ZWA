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
    require("utils.php");
    getDataForJs("user","users", "username,uuid,icon,settings");
        ?>
</head>

<body>
    <?php
    getDataVisual("users","users", "*");
    
    if (userExist("bukovja4")) {
        echo "bukovja4 does exist";
    } else {
        echo "bukovja4 does not exist";
    }
    echo "\n";
    if (userExist("bukovja5")) {
        echo "bukovja5 does exist";
    } else {
        echo "bukovja5 does not exist";
    }
    echo "\n". newUuid();
    ?>

    <?php
    $conn = null;
    ?>

</body>

</html>