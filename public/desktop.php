<?php
require("db.php");
if (!sessionIsValid()) {
    header("Location: error.php?code=401");
    die();
}
?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Plocha</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/desktop/desktop.css">

    <link rel="icon" href="media/favicon.png" type="image/png" sizes="256x256">
    <meta name="author" content="Jan Oskar Bukovský">
    <meta name="description" content="ZWA project">
    <meta name="Content-Type" content="text/html">

    <script src="js/classes.js"></script>
    <script src="js/utils.js"></script>
    <!-- <script src="js/testData.js"></script> -->
    <?php
    $querySessions = getData("vSessions", "user", ["vSession"], [$_SESSION["uuid"]]);
    $DBSessionUser = $querySessions->fetchAll();

    $queryUsers = getData("users", "uuid", ["username"], [$DBSessionUser[0]["user"]]);
    $DBUser = $queryUsers->fetchAll();

    getDataForJs("vNodes", "vNode", "vNodes", "uuid,type,parent,timeCreate,timeEdit,timeRead,owner,permissions,name,description,size,data,icon", ["owner"], [$DBUser[0]["uuid"]]);
    getDataForJs("userIdentifier", "user", "users", "username,uuid,icon,settings", ["uuid"], [$DBUser[0]["uuid"]]);
    ?>
    <script defer src="js/setup.js"></script>
    <script defer src="js/events.js"></script>
    <script defer src="js/main.js"></script>

    <noscript>
        <link rel="stylesheet" type="text/css" href="css/desktop/noscript.css">
    </noscript>

    <link rel="prefetch" href="explorer.php">
    <link rel="prefetch" href="administration.php">
    <link rel="prefetch" href="media/login/bloomReverse.mp4">
</head>

<body>
    <div id="desktop" class="working-area no-select">
    </div>
    <div id="windows" class="working-area">
    </div>
    <div id="navbar" class="no-select">
        <div class="navbar-menu">
            <div class="navbar-button-content"></div>
            <div class="main-menu navbar-popup">
                <div id="id107cb35be4427"
                    a='{"t":"r","v":"1.2","lang":"cs","locs":[849],"ssot":"c","sics":"ds","cbkg":"#FFFFFF00","cfnt":"rgba(255,255,255,1)","codd":"#FFFFFF00","cont":"rgba(255,255,255,0.8313725490196079)"}'>
                    Weather Data Source: <a href="https://sharpweather.com/weather_prague/30_days/">Prague 30 days
                        weather</a></div>
                <script async src="https://static1.sharpweather.com/widgetjs/?id=id107cb35be4427"></script>
                <iframe class="rss-feed" title="rss-feed" src='https://widget.tagembed.com/2146452'></iframe>
                <div class="controls">
                    <div class="user">
                        <div class="user-avatar">
                            <img src="https://api.dicebear.com/9.x/identicon/svg?seed=demoUser&rowColor=ffb300"
                                alt="user-avatar-icon">
                        </div>
                        <span>demoUser</span>
                    </div>
                    <span class="material-symbols-rounded" id="powerButton">
                        power_settings_new
                    </span>
                </div>
            </div>
        </div>
        <div class="navbar-search">
            <div class="navbar-button-content searchbar"></div>
            <div class="search-menu navbar-popup">
                <div class="search-bar">
                    <input id="navbar-search-bar" type="search" placeholder="Sem zadejte hledaný výraz" pattern="\w{1,}"
                        autocomplete="off" required>
                </div>
                <div class="search-content">
                    <div class="search-results">
                    </div>
                    <div class="search-item-description">
                    </div>
                </div>
            </div>
        </div>
        <div class="navbar-spacer"></div>
        <div class="navbar-screen navbar-volume navbar-bluetooth navbar-battery">
            <div class="navbar-button-content">
                <div class="navbar-screen">
                    <span class="material-symbols-rounded">
                        light_mode
                    </span>
                </div>
                <!-- <div class="volume">
                    <span class="material-symbols-rounded">
                        volume_up
                    </span>
                </div> -->
            </div>
            <div class="screen-menu navbar-popup">
                <div class="slider-brightness">
                    <span class="material-symbols-rounded">
                        sunny
                    </span>
                    <input type="range" min="0" max="100" step="1" value="100">
                    <span class="material-symbols-rounded">
                        brightness_6
                    </span>
                </div>
                <div class="slider-blue-light-filter">
                    <span class="routine material-symbols-rounded fill">
                        routine
                    </span>
                    <input type="range" min="0" max="100" step="1" value="0">
                    <span class="bedtime material-symbols-rounded fill">
                        bedtime
                    </span>
                </div>
            </div>
        </div>
        <div class="navbar-time navbar-notifications">
            <div class="navbar-button-content datetime">
                <span id="datetime"></span>
                <span id="notifications" class="material-symbols-rounded">
                    notifications
                </span>
            </div>
            <div class="calendar-container notifications-container">
                <div class="notifications-wrapper">
                    <header class="notifications-header">
                        <span class="notification-navigation">Oznámení</span>
                        <span class="clear-all-notifications">Vymazat vše</span>
                    </header>
                    <div class="notifications-content"></div>
                </div>
                <div class="calendar-wrapper">
                    <header class="calendar-header">
                        <p class="calendar-current-date"></p>
                        <div class="calendar-navigation">
                            <span id="calendar-prev" class="material-symbols-rounded">
                                arrow_drop_up
                            </span>
                            <span id="calendar-next" class="material-symbols-rounded">
                                arrow_drop_down
                            </span>
                        </div>
                    </header>

                    <div class="calendar-body">
                        <ul class="calendar-weekdays">
                            <li>po</li>
                            <li>út</li>
                            <li>st</li>
                            <li>čt</li>
                            <li>pá</li>
                            <li>so</li>
                            <li>ne</li>
                        </ul>
                        <ul class="calendar-dates"></ul>
                    </div>
                </div>
            </div>
            <div class="time-tooltip">
                <span>time</span>
                <span>date</span>
            </div>
            <div class="extra-notifications"></div>
        </div>
        <div class="navbar-minimize"></div>
    </div>
    <div class="errors hidden no-select">
    </div>
    <div class="uploading">
        <input type="file" id="fileUpload" name="fileUpload" class="hidden" aria-hidden="true">
    </div>
    <div class="brightness"></div>
    <div class="blue-light-filter"></div>
</body>

</html>