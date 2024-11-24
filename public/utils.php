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
        $file = dirname(__FILE__) . getParentDir($result["parent"]) . $result["parent"] . "/" . $result["name"];
    }

    try {
        if (!isset($file) || !file_exists($file)) {
            echo "file didnt exist";
            br();
            echo $file;
            header("Location: error.php?code=404");
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
    return true;
}

function createFile($type, $parentUuid)
{
    global $conn;
    $sql = "INSERT INTO vNodes (uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions, name, description, size, data, icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $timestamps = [];

    try {
        if ($_POST["type"] == "file") {
            if (!isset($file) || !file_exists($file)) {
                return null;
            }
            foreach ($_FILES["fileUpload"]["error"] as $key => $error) {
                if ($error == UPLOAD_ERR_OK) {
                    $newUuid = newUuid();
                    $timestamp = floor(microtime(true) * 1000);

                    $query = getData("vNodes", "uuid, data", ["uuid"], [$parentUuid]);
                    $results = $query->fetchAll();

                    if (count($results) != 1) {
                        return null;
                    }

                    $parentDir = json_decode($results[0]["data"])->data[0] . $results[0]["uuid"] . "/";

                    $tmp_name = $_FILES["fileUpload"]["tmp_name"][$key];
                    $name = basename($_FILES["fileUpload"]["name"][$key]);

                    $query = $conn->prepare($sql);
                    $query->execute(array($newUuid, "file", $parentUuid, $timestamp, $timestamp, $timestamp, $_SESSION["userUuid"], '{"canDelete":true}', $name, "Složka", 0, '{"data":["/' . $parentDir . '/"]}', null));

                    move_uploaded_file($tmp_name, "$parentDir/$name");
                    array_push($timestamps, [$newUuid => $timestamp]);
                } else {
                    return null;
                }
            }
        } elseif ($_POST["type"] == "folder") {
            $newUuid = newUuid();
            $timestamp = floor(microtime(true) * 1000);

            $query = getData("vNodes", "uuid, data, parent", ["uuid"], [$parentUuid]);
            $results = $query->fetchAll();

            if (count($results) != 1) {
                return null;
            }

            $parentDir = getParentDir($parentUuid);
            // echo dirname(__FILE__) . $parentDir . $parentUuid . "/" . $newUuid;

            $query = $conn->prepare($sql);
            $query->execute(array($newUuid, "folder", $parentUuid, $timestamp, $timestamp, $timestamp, $_SESSION["userUuid"], '{"canDelete":true}', $newUuid, "Složka", 0, '{"data":["vComputer:/' . $parentDir . '"]}', null));

            mkdir(dirname(__FILE__) . $parentDir . $parentUuid . "/" . $newUuid);
            // echo $parentDir . $newUuid;
            return [getDataForJson("vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data,icon", ["uuid"], [$newUuid])];
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    return null;
}

function getParentDir($uuid)
{
    $parentDir = "/user-data";

    $query = getData("vNodes", "uuid, data, parent", ["uuid"], [$uuid]);
    $results = $query->fetchAll();

    return $parentDir . json_decode($results[0]["data"])->data[0];
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

    return $timestamp;
}

function findFiles($query)
{
    $results = [];

    return $results;
}

function returnJSONResponse($jsonData)
{
    header('Content-type: application/json');
    echo json_encode($jsonData);
    die();
}