<?php
require("db.php");
if (!sessionIsValid()) {
    header("Location: error.php?code=403");
    die();
}
?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Prohlížeč souborů</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/explorer/explorer.css">

    <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">
    <meta name="author" content="Jan Oskar Bukovský">
    <meta name="description" content="ZWA project">
    <meta name="Content-Type" content="text/html">

    <script src="js/classes.js"></script>
    <script src="js/utils.js"></script>

    <?php
    $parent = rtrim($_GET["folder"], '/');
    $parentUuid = substr($parent, 1 + strripos($parent, "/"));

    getDataForJs("vNodes", "vNode", "vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data,icon", ["owner", "parent"], [$_SESSION["userUuid"], $parentUuid]);
    ?>
    <script src="js/setup.js"></script>
    <script defer src="js/explorer.js"></script>
</head>

<body class="no-select">
    <div class="header"></div>
    <div class="container">
        <div class="sidebar">
            <hr>
            <hr>
        </div>
        <div class="content">
            <div id="sorting">
                <div class="name by-this descending">Název</div>
                <div class="resize">
                    <div class="drag"></div>
                </div>
                <div class="change">Datum změny</div>
                <div class="resize">
                    <div class="drag"></div>
                </div>
                <div class="type">Typ</div>
                <div class="resize">
                    <div class="drag"></div>
                </div>
                <div class="size">Velikost</div>
            </div>
            <div id="files">
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový dokument.txt</span>
                    </div>
                    <span class="change">1.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">1 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">8.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">2 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Textový dokument.txt</span>
                    </div>
                    <span class="change">4.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">3 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">1234567890.txt</span>
                    </div>
                    <span class="change">9.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">4 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Abcdef.txt</span>
                    </div>
                    <span class="change">15.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">5 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový.txt</span>
                    </div>
                    <span class="change">25.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">6 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">dokument.txt</span>
                    </div>
                    <span class="change">30.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">7 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">20.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">8 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový dokument.txt</span>
                    </div>
                    <span class="change">1.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">1 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">8.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">2 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Textový dokument.txt</span>
                    </div>
                    <span class="change">4.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">3 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">1234567890.txt</span>
                    </div>
                    <span class="change">9.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">4 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Abcdef.txt</span>
                    </div>
                    <span class="change">15.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">5 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový.txt</span>
                    </div>
                    <span class="change">25.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">6 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">dokument.txt</span>
                    </div>
                    <span class="change">30.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">7 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">20.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">8 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový dokument.txt</span>
                    </div>
                    <span class="change">1.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">1 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">8.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">2 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Textový dokument.txt</span>
                    </div>
                    <span class="change">4.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">3 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">1234567890.txt</span>
                    </div>
                    <span class="change">9.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">4 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Abcdef.txt</span>
                    </div>
                    <span class="change">15.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">5 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový.txt</span>
                    </div>
                    <span class="change">25.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">6 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">dokument.txt</span>
                    </div>
                    <span class="change">30.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">7 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">20.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">8 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový dokument.txt</span>
                    </div>
                    <span class="change">1.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">1 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">8.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">2 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Textový dokument.txt</span>
                    </div>
                    <span class="change">4.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">3 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">1234567890.txt</span>
                    </div>
                    <span class="change">9.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">4 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Abcdef.txt</span>
                    </div>
                    <span class="change">15.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">5 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový textový.txt</span>
                    </div>
                    <span class="change">25.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">6 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">dokument.txt</span>
                    </div>
                    <span class="change">30.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">7 kB</span>
                </div>
                <div class="file">
                    <div class="name">
                        <img src="media/file-icons/text.webp" alt="file-icon" class="icon">
                        <span class="name">Nový dokument.txt</span>
                    </div>
                    <span class="change">20.10.2024 15:56</span>
                    <span class="type">Textový dokument</span>
                    <span class="size">8 MB</span>
                </div>
            </div>
        </div>
    </div>
    <div id="footer">
        <span class="total">Počet položek:</span>
        <span class="selected">.</span>
    </div>
    <div class="uploading">
        <input type="file" id="fileUpload" name="fileUpload" class="hidden">
    </div>
</body>

</html>