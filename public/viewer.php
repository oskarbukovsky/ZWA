<?php
include("utils.php");
require("db.php");

if (isset($_GET["method"]) && ($_GET["method"] == "sharing")) {
    if (!isset($_GET["uuid"])) {
        header("Location: error.php?code=404");
        die();
    }

    $query = getData("vSessions", "validUntil, file", ["vSession"], [$_GET["uuid"]]);
    $results = $query->fetchAll();

    if (count($results) < 1) {
        header("Location: error.php?code=404");
        die();
    }

    $result = $results[0];
    if ($result["validUntil"] < floor(microtime(true) * 1000)) {
        deleteData("vSessions", ["vSession"], [$_GET["uuid"]]);
        header("Location: error.php?code=401");
        die();
    }

    if (!printFile($result["file"])) {
        header("Location: error.php?code=401");
        die();
    }
} else {
    if (!sessionIsValid()) {
        header("Location: error.php?code=401");
        die();
    }

    if (!isset($_GET["uuid"])) {
        header("Location: error.php?code=404");
        die();
    }

    if (isset($_GET["edit"]) && ($_GET["edit"] == "true")) {
        if (!editFile($_GET["uuid"])) {
            header("Location: error.php?code=401");
            die();
        }
    } else {
        if (!printFile($_GET["uuid"])) {
            header("Location: error.php?code=401");
            die();
        }
    }
}