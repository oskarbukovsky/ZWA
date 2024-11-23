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

function returnJSONResponse($jsonData)
{
    header('Content-type: application/json');
    echo json_encode($jsonData);
    die();
}