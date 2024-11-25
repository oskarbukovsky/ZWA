<?php

require("db.php");
require("utils.php");

if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != "XMLHttpRequest") {
    header("Location: error.php?code=403");
    die();
}

if (!sessionIsValid()) {
    returnJSONResponse(["status" => "error", "details" => "sessionTimeout"]);
}

if (!isset($_POST["method"])) {
    returnJSONResponse(["status" => "error", "details" => "missingMethod"]);
}

if ($_POST["method"] == "timeoutCheck") {
    returnJSONResponse(["status" => "ok"]);
}

if ($_POST["method"] == "upload") {
    if (!isset($_POST["parent"])) {
        returnJSONResponse(["status" => "error", "errorType" => "missingParent"]);
    }
    $status = uploadFile($_POST["parent"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryUploaded", "item" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToUpload"]);
    }
} elseif ($_POST["method"] == "create") {
    if (!isset($_POST["type"])) {
        returnJSONResponse(["status" => "error", "details" => "missingType"]);
    }
    if (!isset($_POST["parent"])) {
        returnJSONResponse(["status" => "error", "details" => "missingParent"]);
    }
    $status = createFile($_POST["type"], $_POST["parent"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryCreated", "item" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToCreate"]);
    }
} elseif ($_POST["method"] == "modify") {
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    $status = modifyFile($_POST["fileUuid"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryUpdated", "uuid" => $updatedNode, "timestamp" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToUpdate", "uuid" => $_POST["fileUuid"]]);
    }
} elseif ($_POST["method"] == "delete") {
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    if (deleteFile($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "ok", "details" => "entryDeleted", "uuid" => $_POST["fileUuid"]]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToDelete", "uuid" => $_POST["fileUuid"]]);
    }
} elseif ($_POST["method"] == "read") {
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    $status = readFileMetadata($_POST["fileUuid"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryRead", "uuid" => $_POST["fileUuid"], "timestamp" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToRead", "uuid" => $_POST["fileUuid"]]);
    }
} elseif ($_POST["method"] == "search") {
    if (!isset($_POST["query"])) {
        returnJSONResponse(["status" => "error", "details" => "missingQuery"]);
    }
    $status = findFiles($_POST["query"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "searchResults", "results" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "ErroInDB"]);
    }
}

returnJSONResponse(["status" => "error", "details" => "unknownMethod"]);