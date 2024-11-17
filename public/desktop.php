<?php
require("db.php");
if (!sessionIsValid()) {
    // echo "Invalid from desktop";
    header("Location: index.php?event=session-timeout");
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

    <link rel="prefetch" href="explorer.html">
    <link rel="prefetch" href="administration.html">
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
            <div class="search-menu navbar-popup"></div>
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
                    <span class="material-symbols-rounded">
                        routine
                    </span>
                    <input type="range" min="0" max="100" step="1" value="0">
                    <span class="material-symbols-rounded fill">
                        bedtime
                    </span>
                </div>
            </div>
        </div>
        <div class="navbar-time">
            <div class="navbar-button-content datetime">
                <span id="datetime"></span>
                <span id="notifications" class="material-symbols-rounded">
                    notifications
                </span>
            </div>
            <div class="calendar-container">
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
            <div class="time-tooltip">
                <span>time</span>
                <span>date</span>
            </div>
        </div>
        <div class="navbar-minimize"></div>
    </div>
    <div class="errors hidden no-select">
    </div>
    <div class="uploading">
        <input type="file" id="fileUpload" name="fileUpload" class="hidden">
    </div>
    <div class="brightness"></div>
    <div class="blue-light-filter"></div>

    <!-- TODO -->
    <!-- <span class="battery">
        <div class="charger"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none"
                viewBox="0 0 24 24">
                <path fill="#000" stroke="#f3f3f3" stroke-width="2"
                    d="m8.294 14-1.767 7.068c-.187.746.736 1.256 1.269.701L19.79 9.27A.75.75 0 0 0 19.25 8h-4.46l1.672-5.013A.75.75 0 0 0 15.75 2h-7a.75.75 0 0 0-.721.544l-3 10.5A.75.75 0 0 0 5.75 14h2.544Z">
                </path>
            </svg></div><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24">
            <path xmlns="http://www.w3.org/2000/svg" fill="#000"
                d="M17 6a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h12Zm-.002 1.5H5a1.5 1.5 0 0 0-1.493 1.356L3.5 9v6a1.5 1.5 0 0 0 1.355 1.493L5 16.5h11.998a1.5 1.5 0 0 0 1.493-1.355l.007-.145V9a1.5 1.5 0 0 0-1.355-1.493l-.145-.007Z">
            </path>
        </svg>
        <div class="btFull" style="width: 100%;"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                fill="none" viewBox="0 0 24 24">
                <path fill="#000"
                    d="M17 6a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h12Zm-.002 1.5H5a1.5 1.5 0 0 0-1.494 1.356L3.5 9v6a1.5 1.5 0 0 0 1.355 1.493L5 16.5h11.998a1.5 1.5 0 0 0 1.493-1.355l.007-.145V9a1.5 1.5 0 0 0-1.355-1.493l-.145-.007ZM6 9h10a1 1 0 0 1 .993.883L17 10v4a1 1 0 0 1-.883.993L16 15H6a1 1 0 0 1-.993-.883L5 14v-4a1 1 0 0 1 .883-.993L6 9h10H6Z">
                </path>
            </svg></div>
    </span> -->
</body>

</html>