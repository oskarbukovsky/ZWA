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

function print404() {
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
}

function printExpired() {
    echo '<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Expired</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" type="text/css" href="css/sharingExpired.css">
    
    <link rel="icon" href="media/favicon.png" type="image/png" sizes="256x256">
    </head>
    <body>
    </body>
    </html>';
}