<?php

require("db.php");
require("utils.php");

if ((isset($_POST["method"]) && $_POST["method"] == "logout") || (isset($_GET["method"]) && $_GET["method"] == "logout")) {
    if (isset($_SESSION["uuid"])) {
        deleteData("vSessions", ["vSession"], [$_SESSION["uuid"]]);
    }
    session_unset();
    session_destroy();
    header("Location: index.php?event=logout");
    die();
}

if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header("Location: error.php?code=403");
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
}

if ($_POST["method"] == "login") {
    if (!isset($_POST["username"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Location: index.php?type=login&error=missing-username");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "missing-username", "method" => "login"]);
            die();
        }
    }
    if (strlen($_POST["username"]) < 5 || strlen($_POST["username"]) >= 16) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=login&error=username-too-short");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "username-too-short", "method" => "login"]);
            die();
        }
    }
    if (!isset($_POST["password"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=login&error=missing-password");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "missing-password", "method" => "login"]);
            die();
        }
    }
    if (!userExist($_POST["username"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=login&error=user-do-not-exist");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "user-do-not-exist", "method" => "login"]);
            die();
        }
    }
    if (!loginAuth($_POST["username"], $_POST["password"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=login&error=wrong-credentials");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "wrong-credentials", "method" => "login"]);
            die();
        }
    }
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
        sessionSet($_POST["username"]);
        header("Location: desktop.php");
    } else {
        returnJSONResponse(["status" => "ok", "details" => "loginSuccess", "method" => "login"]);
        die();
    }
    die();
} elseif ($_POST["method"] == "register") {
    if (!isset($_POST["username"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Location: index.php?type=register&error=missing-username");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "missing-username", "method" => "register"]);
            die();
        }
    }
    if (strlen($_POST["username"]) < 5 || strlen($_POST["username"]) >= 16) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=register&error=username-too-short");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "username-too-short", "method" => "register"]);
            die();
        }
    }
    if (!isset($_POST["password"]) || !isset($_POST["passwordAgain"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=register&error=missing-password");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "missing-password", "method" => "register"]);
            die();
        }
    }
    if (userExist($_POST["username"])) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=register&error=user-already-exist");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "user-already-exist", "method" => "register"]);
            die();
        }
    }
    if ($_POST["password"] != $_POST["passwordAgain"]) {
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
            header("Set-cookie: " . "Prefill-username=" . htmlspecialchars($_POST["username"]) . "; expires=" . date('D, Y-M-d H:i:s', time() + 3600) . " GMT; path=/; HttpOnly; secure=true; SameSite=Strict");
            header("Location: index.php?type=register&error=passwords-do-not-match");
            die();
        } else {
            returnJSONResponse(["status" => "error", "details" => "passwords-do-not-match", "method" => "register"]);
            die();
        }
    }
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
        newUser($_POST["username"], $_POST["password"]);

        sessionSet($_POST["username"]);
        header("Location: desktop.php?welcome=true");
        die();
    } else {
        returnJSONResponse(["status" => "ok", "details" => "registerSuccess", "method" => "register"]);
        die();
    }
}