<?php

if (!isset($_POST["method"])) {
    header("Location: index.php");
    return;
}

require("db.php");
require("utils.php");
session_cache_expire(480);
session_start();

if ($_POST["method"] == "login") {
    if (!isset($_POST["username"])) {
        header("Location: index.php?type=login&error=missing-username");
        return;
    }
    if (!isset($_POST["password"])) {
        header("Location: index.php?type=login&error=missing-password");
        return;
    }
    if (!userExist($_POST["username"])) {
        header("Location: index.php?type=login&error=user-do-not-exist");
        return;
    }
    if (!loginAuth($_POST["username"], $_POST["password"])) {
        header("Location: index.php?type=login&error=wrong-credentials");
        return;
    }

    sessionSet($_POST["username"]);
    header("Location: desktop.php");
    die();
}

if ($_POST["method"] == "register") {
    if (!isset($_POST["username"])) {
        header("Location: index.php?type=register&error=missing-username");
        return;
    }
    if (!isset($_POST["password"]) || !isset($_POST["passwordAgain"])) {
        header("Location: index.php?type=register&error=missing-password");
        return;
    }
    if (userExist($_POST["username"])) {
        header("Location: index.php?type=register&error=user-already-exist");
        return;
    }
    if ($_POST["password"] != $_POST["passwordAgain"]) {
        header("Location: index.php?type=register&error=password-do-not-match");
        return;
    }
    newUser($_POST["username"], $_POST["password"]);

    sessionSet($_POST["username"]);
    header("Location: desktop.php?welcome=true");
    die();
}

if ($_POST["method"] == "logout" || $_GET["method"] == "logout") {
    // session_unset();
    // session_destroy();
    deleteData("vSessions", ["vSession"], [trim($_SESSION["uuid"])]);
    $_SESSION["logged"] = false;
    $_SESSION["uuid"] = "";
    header("Location: index.php?event=logout");
    die();
}