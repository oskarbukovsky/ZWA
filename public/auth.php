<?php

require("db.php");
require("utils.php");

if ((isset($_POST["method"]) && $_POST["method"] == "logout") || (isset($_GET["method"]) && $_GET["method"] == "logout")) {
    if (isset($_SESSION["uuid"])) {
        deleteData("vSessions", ["vSession"], [$_SESSION["uuid"]]);
    }
    session_destroy();
    header("Location: index.php?event=logout");
    die();
}

if (isset($_SESSION["logged"])) {
    header("Location: desktop.php");
    die;
}

if (!isset($_POST["method"])) {
    header("Location: index.php");
    die();
}

if ($_POST["method"] == "login") {
    if (!isset($_POST["username"])) {
        header("Location: index.php?type=login&error=missing-username");
        die();
    }
    if (!isset($_POST["password"])) {
        header("Location: index.php?type=login&error=missing-password");
        die();
    }
    if (!userExist($_POST["username"])) {
        header("Location: index.php?type=login&error=user-do-not-exist");
        die();
    }
    if (!loginAuth($_POST["username"], $_POST["password"])) {
        header("Location: index.php?type=login&error=wrong-credentials");
        die();
    }

    sessionSet($_POST["username"]);
    header("Location: desktop.php");
    die();
}

if ($_POST["method"] == "register") {
    if (!isset($_POST["username"])) {
        header("Location: index.php?type=register&error=missing-username");
        die();
    }
    if (!isset($_POST["password"]) || !isset($_POST["passwordAgain"])) {
        header("Location: index.php?type=register&error=missing-password");
        die();
    }
    if (userExist($_POST["username"])) {
        header("Location: index.php?type=register&error=user-already-exist");
        die();
    }
    if ($_POST["password"] != $_POST["passwordAgain"]) {
        header("Location: index.php?type=register&error=password-do-not-match");
        die();
    }
    newUser($_POST["username"], $_POST["password"]);

    sessionSet($_POST["username"]);
    header("Location: desktop.php?welcome=true");
    die();
}