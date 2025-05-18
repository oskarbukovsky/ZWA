<?php
    if (!isset($_GET["code"])) {
        header("Location: index.php?error=unknown");
        die();
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Error</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?= '<link rel="stylesheet" type="text/css" href="css/' . htmlspecialchars($_GET["code"]) . '.css">' ?>
    <link rel="icon" href="media/favicon.png" type="image/png" sizes="256x256">

    <script src="js/utils.js"></script>
    <script src="js/4xx.js"></script>
</head>

<body>
</body>

</html>