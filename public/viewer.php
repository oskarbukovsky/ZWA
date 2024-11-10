<?php
include("utils.php");

require("db.php");
if (sessionIsValid()) {
    header("Location: index.php?event=session-timeout");
    die();
}

if (!isset($_GET["uuid"])) {
    echo "file Uuid not set !!!";
    die();
}

$query = getData("vNodes", "owner, data, name", ["uuid"], [$_GET["uuid"]]);
$results = $query->fetchAll();

foreach ($results as $result) {
    $json = json_decode($result["data"]);
    $file = "user-data/" . $result["owner"] . $json->data[0] . $result["name"];
}

try {
    if (!file_exists($file)) {
        echo '<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>404</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    
                    <link rel="stylesheet" type="text/css" href="css/404.css">

                    <link rel="icon" href="media/favicon.png" type="image/png" sizes="256x256">
                </head>
            <body>
            </body>
            </html>';
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