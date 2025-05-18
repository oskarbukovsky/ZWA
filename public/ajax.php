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

switch ($_POST["method"]) {
    case "upload":
        handleUpload();
    case "create":
        handleCreate();
    case "rename":
        handleRename();
    case "modify":
        handleModify();
    case "delete":
        handleDelete();
    case "read":
        handleRead();
    case "search":
        handleSearch();
    case "userResetPassword":
        handleUserResetPassword();
    case "userPromote":
        handleUserPromote();
    case "userDemote":
        handleUserDemote();
    case "userDelete":
        handleUserDelete();
    default:
        returnJSONResponse(["status" => "error", "details" => "unknownMethod"]);
}

function handleUpload()
{
    if (!isset($_POST["parent"])) {
        returnJSONResponse(["status" => "error", "errorType" => "missingParent"]);
    }
    $status = uploadFile($_POST["parent"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryUploaded", "item" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToUpload"]);
    }
}

function handleCreate()
{
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
}

function handleRename() {
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    if (!isset($_POST["newName"])) {
        returnJSONResponse(["status" => "error", "details" => "missingNewName"]);
    }
    $status = renameFile($_POST["fileUuid"], $_POST["newName"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryRenamed", "uuid" => $_POST["fileUuid"], "timestamp" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToRename", "uuid" => $_POST["fileUuid"]]);
    }
}

function handleModify()
{
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    $status = modifyFile($_POST["fileUuid"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryUpdated", "uuid" => $_POST["fileUuid"], "timestamp" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToUpdate", "uuid" => $_POST["fileUuid"]]);
    }
}

function handleDelete()
{
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    if (deleteFile($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "ok", "details" => "entryDeleted", "uuid" => $_POST["fileUuid"]]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToDelete", "uuid" => $_POST["fileUuid"]]);
    }
}

function handleRead()
{
    if (!isset($_POST["fileUuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingFileUuid"]);
    }
    $status = readFileMetadata($_POST["fileUuid"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "entryRead", "uuid" => $_POST["fileUuid"], "timestamp" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToRead", "uuid" => $_POST["fileUuid"]]);
    }
}

function handleSearch()
{
    if (!isset($_POST["query"])) {
        returnJSONResponse(["status" => "error", "details" => "missingQuery"]);
    }
    $status = findFiles($_POST["query"]);
    if ($status !== null) {
        returnJSONResponse(["status" => "ok", "details" => "searchResults", "results" => $status]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "ErrorInDB"]);
    }
}

function handleUserResetPassword()
{
    if (!isset($_POST["uuid"])) {
        returnJSONResponse(["status" => "error", "details" => "missingUuid"]);
    }
    if (!isset($_POST["newPassword"])) {
        returnJSONResponse(["status" => "error", "details" => "missingNewPassword"]);
    }
    if (resetPassword($_POST["uuid"], password_hash(htmlspecialchars($_POST["newPassword"]), PASSWORD_DEFAULT))) {
        returnJSONResponse(["status" => "ok", "details" => "passwordChangeSuccess", "uuid" => $_POST["uuid"]]);
    } else {
        returnJSONResponse(["status" => "error", "details" => "unableToChangePassword", "uuid" => $_POST["uuid"]]);
    }
}

function handleUserPromote()
{
    $query = getData("users", "role", ["uuid"], [$_SESSION["userUuid"]]);
    $data = $query->fetchAll();

    if ($data[0]["role"] == "100") {
        if (!isset($_POST["uuid"])) {
            returnJSONResponse(["status" => "error", "details" => "missingUuid"]);
        }
        if (promoteUser($_POST["uuid"])) {
            returnJSONResponse(["status" => "ok", "details" => "promotionSuccess", "uuid" => $_POST["uuid"]]);
        }
    }
    returnJSONResponse(["status" => "error", "details" => "unableToDemote", "uuid" => $_POST["uuid"]]);
}

function handleUserDemote()
{
    $query = getData("users", "role", ["uuid"], [$_SESSION["userUuid"]]);
    $data = $query->fetchAll();

    if ($data[0]["role"] == "100") {
        if (!isset($_POST["uuid"])) {
            returnJSONResponse(["status" => "error", "details" => "missingUuid"]);
        }
        if (demoteUser($_POST["uuid"])) {
            returnJSONResponse(["status" => "ok", "details" => "demotionSuccess", "uuid" => $_POST["uuid"]]);
        }
    }
    returnJSONResponse(["status" => "error", "details" => "unableToPromote", "uuid" => $_POST["uuid"]]);
}

function handleUserDelete()
{
    $query = getData("users", "role", ["uuid"], [$_SESSION["userUuid"]]);
    $data = $query->fetchAll();

    if ($data[0]["role"] == "100") {
        if (!isset($_POST["uuid"])) {
            returnJSONResponse(["status" => "error", "details" => "missingUuid"]);
        }
        if (deleteUser($_POST["uuid"])) {
            returnJSONResponse(["status" => "ok", "details" => "deletionSuccess", "uuid" => $_POST["uuid"]]);
        }
    }
    returnJSONResponse(["status" => "error", "details" => "unableToDelete", "uuid" => $_POST["uuid"]]);
}