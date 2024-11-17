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
    getDataForJs("vNode","vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data");
        ?>
</head>

<body>
    <?php

    $date = "13.11.2024";
    $parsedDate = explode(".", $date);
    $timestamp = mktime(0,0,0,$parsedDate[1],$parsedDate[0],$parsedDate[2]);
    echo $timestamp;
    $dnyVTydnu = [
        "1"=> "pondělí",
        "úterý",
        "středa",
        "čtvrtek",
        "pátek",
        "sobota",
        "neděle"
    ];

    echo $dnyVTydnu[date("N", $timestamp)];

    getDataVisual("vNodes", "vNodes", "*");
    ?>

    <?php
    $conn = null;
    ?>
</body>

</html>