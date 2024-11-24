<?php

require("db.php");
require("utils.php");

if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
    header("Location: error.php?code=401");
    die();
}

if (!sessionIsValid()) {
    returnJSONResponse(["status" => "error", "errorType" => "sessionTimeout"]);
}

if (!isset($_POST["method"])) {
    returnJSONResponse(["status" => "error", "errorType" => "missingMethod"]);
}

if ($_POST["method"] == "timeoutCheck") {
    returnJSONResponse(["status" => "ok"]);
}

if (!isset($_POST["fileUuid"])) {
    returnJSONResponse(["status" => "error", "errorType" => "missingFileUuid"]);
}

if ($_POST["method"] == "put") {

    returnJSONResponse(["status" => "ok", "details" => "entryCreated", "new" => $newNode]);
} elseif ($_POST["method"] == "patch") {

    returnJSONResponse(["status" => "ok", "details" => "entryUpdated", "updated" => $updatedNode]);
} elseif ($_POST["method"] == "delete") {
    if (deleteFile($_POST["fileUuid"]) && deleteData("vNodes", ["uuid"], [$_POST["fileUuid"]])) {
        returnJSONResponse(["status" => "ok", "details" => "entryDeleted", "uuid" => $_POST["fileUuid"]]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToDelete", "uuid" => $_POST["fileUuid"]]);
    }

} elseif ($_POST["method"] == "read") {

    returnJSONResponse(["status" => "ok", "details" => "entryRead", "uuid" => $_POST["fileUuid"]]);
} elseif ($_POST["method"] == "search") {

    returnJSONResponse(["status" => "ok", "details" => "searchResults", "results" => $searchResults]);
    returnJSONResponse(["status" => "error", "details" => "nothingFound"]);
}

returnJSONResponse(["status" => "error", "errorType" => "unknownMethod"]);