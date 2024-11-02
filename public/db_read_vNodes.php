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
    getData("vNode","vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data");
        ?>
</head>

<body>
    <?php
    getDataVisual("vNodes", "vNodes", "*");
    ?>

    <?php
    $conn = null;
    ?>
</body>

</html>