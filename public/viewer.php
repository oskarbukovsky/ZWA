<?php
include("utils.php");

require("db.php");

if (isset($_GET["method"]) && ($_GET["method"] == "sharing")) {
    if (!isset($_GET["uuid"])) {
        print404();
        die();
    }

    $query = getData("vSessions", "validUntil, file", ["vSession"], [$_GET["uuid"]]);
    $results = $query->fetchAll();

    if (count($results) < 1) {
        print404();
        die();
    }

    foreach ($results as $result) {
        if ($result["validUntil"] < time()) {
            deleteData("vSessions", ["vSession"], [$_GET["uuid"]]);
            printExpired();
            die();
        }

        printFile($result["file"]);
    }
} else {
    if (!sessionIsValid()) {
        header("Location: index.php?event=session-timeout");
        die();
    }

    if (!isset($_GET["uuid"])) {
        print404();
        die();
    }

    printFile($_GET["uuid"]);
}

function printFile($uuid)
{
    $query = getData("vNodes", "owner, data, name", ["uuid"], [$uuid]);
    $results = $query->fetchAll();

    foreach ($results as $result) {
        $file = "user-data/" . $result["owner"] . json_decode($result["data"])->data[0] . $result["name"];
    }

    try {
        if (!isset($file) || !file_exists($file)) {
            print404();
            die();
        }

        $finfo = new finfo(FILEINFO_MIME);
        $fileContentType = finfo_file($finfo, $file);
        header("Content-Type: " . $fileContentType);
        finfo_close($finfo);

        readfile($file);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}