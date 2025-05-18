<?php
if (isset($_POST["theme"])) {
    setcookie("theme", $_POST["theme"]);
    header("Location: 10.php");
} ?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            color: light-dark(#000, #fff);
            background-color: light-dark(#fff, #000);
        }
    </style>
    <?php
    if (isset($_COOKIE["theme"])) {
        if ($_COOKIE["theme"] == "dark") {
            echo '<style>
            :root {
                color-scheme: dark;
            }
            </style>';
        }
    } else {
        echo '<style>
            :root {
                color-scheme: light;
            }
            </style>';
    }


    ?>
</head>

<body>
    <form action="" method="POST">
        <div>
            <label for="theme">Theme:</label>
            <select name="theme" id="theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
            <input type="submit" value="Change theme">
        </div>
    </form>
</body>

</html>