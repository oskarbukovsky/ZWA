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

    foreach ($results as $result) {
        if ($result["validUntil"] < time()) {
            deleteData("vSessions", ["vSession"], [$_GET["uuid"]]);
            header("Location: error.php?code=401");
            die();
        }

        printFile($result["file"]);
    }
} else {
    if (!sessionIsValid()) {
        header("Location: error.php?code=403");
        die();
    }

    if (!isset($_GET["uuid"])) {
        header("Location: error.php?code=404");
        die();
    }

    printFile($_GET["uuid"]);
}