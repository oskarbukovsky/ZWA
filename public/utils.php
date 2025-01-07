<?php

function newUuid()
{
    return trim(file_get_contents("/proc/sys/kernel/random/uuid"));
}

function br()
{
    echo nl2br("\n");
}

if (isset($_GET["remove"])) {
    removeDir($_GET["remove"]);
}

function removeDir(string $dir): void
{
    $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
    $files = new RecursiveIteratorIterator(
        $it,
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($files as $file) {
        if ($file->isDir()) {
            rmdir($file->getPathname());
        } else {
            unlink($file->getPathname());
        }
    }
    rmdir($dir);
}

function printFile($uuid)
{
    $query = getData("users", "role", ["uuid"], [$_SESSION["userUuid"]]);
    $user = $query->fetchAll();

    if (count($user) != 1) {
        return false;
    }

    $query = getData("vNodes", "parent,name,parent", ["uuid"], [$uuid]);
    $results = $query->fetchAll();

    foreach ($results as $result) {
        // $file = "user-data/" . $result["owner"] . json_decode($result["data"])->data[0] . $result["name"];
        $file = getParentDir($result["parent"]) . $result["name"];
    }

    try {
        if (!isset($file) || !file_exists($file)) {
            // echo "file didnt exist";
            // br();
            // echo $file;
            header("Location: error.php?code=404");
            die();
        }

        $finfo = new finfo(FILEINFO_MIME);
        $fileContentType = finfo_file($finfo, $file);
        // TODO: check: mime_content_type($file);
        header("Content-Type: " . $fileContentType);
        finfo_close($finfo);

        readfile($file);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    return true;
}

function uploadFile($parentUuid)
{
    global $conn;
    $sql = "INSERT INTO vNodes (uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions, name, description, size, data, icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    try {
        if (count($_FILES) != 1 || $_FILES["fileUpload"]["error"] != UPLOAD_ERR_OK) {
            return null;
        }

        $newUuid = newUuid();
        $timestamp = floor(microtime(true) * 1000);

        $query = getData("vNodes", "uuid, data, parent", ["uuid"], [$parentUuid]);
        $results = $query->fetchAll();

        if (count($results) != 1) {
            return null;
        }

        $parentDir = getParentDir($parentUuid);
        // print(" 111 ");
        // var_dump(str_replace('vComputer://user-data/', "", $parentDir));
        // print(" 222 ");

        if (file_exists($parentDir . $_FILES["fileUpload"]["name"])) {
            return null;
        }

        $query = $conn->prepare($sql);
        $sqlPart = $query->execute(array($newUuid, "file", $parentUuid, $timestamp, $timestamp, $timestamp, $_SESSION["userUuid"], '{"canDelete":true}', $_FILES["fileUpload"]["name"], "Nahraný soubor", 0, '{"data":["' . $parentDir . '"]}', null));
        $ioPart = move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $parentDir . $_FILES["fileUpload"]["name"]);
        if (!($sqlPart && $ioPart)) {
            // TODO: handle (partial) fails
            return null;
        }
        return [getDataForJson("vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data,icon", ["uuid"], [$newUuid])];
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    return null;
}

function createFile($type, $parentUuid)
{
    global $conn;
    $sql = "INSERT INTO vNodes (uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions, name, description, size, data, icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    try {
        $newUuid = newUuid();
        $timestamp = floor(microtime(true) * 1000);

        $query = getData("vNodes", "uuid, data, parent", ["uuid"], [$parentUuid]);
        $results = $query->fetchAll();

        if (count($results) != 1) {
            return null;
        }

        $parentDir = getParentDir($parentUuid);
        // print("111 " . $parentDir . " 222");

        if (file_exists($parentDir . $newUuid)) {
            return null;
        }

        $query = $conn->prepare($sql);
        if ($type == "file") {
            $sqlPart = $query->execute(array($newUuid, "file", $parentUuid, $timestamp, $timestamp, $timestamp, $_SESSION["userUuid"], '{"canDelete":true}', $newUuid . ".txt", "Typ: Textový dokument", 0, '{"data":["' . $parentUuid . '"]}', null));
            $ioPart = file_put_contents($parentDir . $newUuid . ".txt", "\xEF\xBB\xBF");
            if (!($sqlPart && $ioPart)) {
                // TODO: handle (partial) fails
                return null;
            }
        } elseif ($type == "folder") {
            $sqlPart = $query->execute(array($newUuid, "folder", $parentUuid, $timestamp, $timestamp, $timestamp, $_SESSION["userUuid"], '{"canDelete":true}', $newUuid, "Složka", 0, '{"data":["vComputer://' . $parentUuid . '"]}', null));
            $ioPart = mkdir($parentDir . $newUuid);
            if (!($sqlPart && $ioPart)) {
                // TODO: handle (partial) fails
                return null;
            }
            // print ("1111 " . $parentDir . $newUuid . " 2222 " . $parentDir . " 3333");
        }
        return [getDataForJson("vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data,icon", ["uuid"], [$newUuid])];
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    return null;
}

function getParentDir($uuid)
{
    $parentDir = dirname(__FILE__) . "/user-data/";

    $query = getData("vNodes", "uuid, data, parent", ["uuid"], [$uuid]);
    $results = $query->fetchAll();

    $json = json_decode($results[0]["data"]);
    if (count($json->data) < 1) {
        return $parentDir . $uuid . "/";
    } else {
        return $parentDir . str_replace("vComputer://", "", $json->data[0]) . $uuid . "/";
    }

}

function modifyFile($uuid)
{
    $timestamp = floor(microtime(true) * 1000);

    return $timestamp;
}

function deleteFile($uuid)
{
    $query = getData("users", "uuid, role", ["uuid"], [$_SESSION["userUuid"]]);
    $user = $query->fetchAll();

    if (count($user) != 1) {
        return false;
    }

    $query = getData("vNodes", "owner, data, name, type, uuid", ["uuid"], [$uuid]);
    $vNode = $query->fetchAll();

    if (count($vNode) != 1) {
        return false;
    }

    if (!($vNode[0]["owner"] == $user[0]["uuid"] || $user[0]["role"] == 100)) {
        return false;
    }

    foreach ($vNode as $result) {
        $file = "user-data/" . $result["owner"] . json_decode($result["data"])->data[0] . $result["name"];
    }

    try {
        if (!isset($file) || !file_exists($file)) {
            return false;
        }
        if ($vNode[0]["type"] == "file") {
            if (unlink($file)) {
                return true;
            }
        } elseif ($vNode[0]["type"] == "folder") {
            removeDir("user-data/" . $result["owner"] . json_decode($result["data"])->data[0] . $result[0]["uuid"]);
            return deleteData("vNodes", ["uuid"], [$_POST["fileUuid"]]);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    return false;
}

function readFileMetadata($uuid)
{
    $timestamp = floor(microtime(true) * 1000);

    updateData("vNodes", ["timeRead"], [$uuid], ["uuid"], [$uuid]);
    $query = getData("vNodes", "timeRead", ["uuid"], [$uuid]);
    $data = $query->fetchAll();
    if (count($data) != 1) {
        return false;
    }
    if ($data[0]["timeRead"] != $timestamp) {
        return false;
    }
    return $timestamp;
}

function findFiles($query)
{
    $results = [];
    $searchQuery = "%$query%";

    global $conn;
    $sql = "SELECT uuid,name FROM vNodes WHERE name LIKE :query";
    $query = $conn->prepare($sql);
    $query->bindParam(":query", $searchQuery);
    try {
        $query->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }

    $data = $query->fetchAll();

    foreach ($data as $vNode) {
        $results[] = ["uuid" => $vNode["uuid"], "name" => $vNode["name"]];
    }


    return $results;
}

function returnJSONResponse($jsonData)
{
    header('Content-type: application/json');
    echo json_encode($jsonData);
    die();
}

function resetPassword($uuid, $newPassword)
{
    updateData("users", ["passwordHash"], [$newPassword], ["uuid"], [$uuid]);
    $query = getData("users", "passwordHash", ["uuid"], [$uuid]);
    $data = $query->fetchAll();
    if (count($data) != 1) {
        return false;
    }
    if ($data[0]["passwordHash"] != $newPassword) {
        return false;
    }
    return true;
}

function promoteUser($uuid)
{
    updateData("users", ["role"], ["100"], ["uuid"], [$uuid]);
    $query = getData("users", "role", ["uuid"], [$uuid]);
    $data = $query->fetchAll();
    if (count($data) != 1) {
        return false;
    }
    if ($data[0]["role"] != "100") {
        return false;
    }
    return true;
}

function demoteUser($uuid)
{
    updateData("users", ["role"], ["000"], ["uuid"], [$uuid]);
    $query = getData("users", "role", ["uuid"], [$uuid]);
    $data = $query->fetchAll();
    if (count($data) != 1) {
        return false;
    }
    if ($data[0]["role"] != "000") {
        return false;
    }
    return true;
}