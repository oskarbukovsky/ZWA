<?php

ini_set("session.gc_maxlifetime", 30000);
ini_set("session.cookie_lifetime", 30000);
session_cache_expire(480);
session_start();

$serverName = "localhost";
$username = "bukovja4";
$password = "Lucinka1221";
$dbname = "bukovja4";

try {
    $conn = new PDO("mysql:host=$serverName;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

function getDataVisual($type, $tablename, $what)
{
    global $conn;

    echo "<table style='border: solid 1px black;'>";

    if ($type == "vNodes") {
        echo "<tr><th>uuid</th><th>description</th><th>name</th><th>owner</th><th>parent</th><th>permissions</th><th>size</th><th>timeCreate</th><th>timeEdit</th><th>timeRead</th><th>type</th><th>data</th></tr>";
    } else if ($type == "users") {
        echo "<tr><th>uuid</th><th>username</th><th>icon</th><th>settings</th><th>passwordHash</th><th>role</th></tr>";
    }
    class TableRows extends RecursiveIteratorIterator
    {
        function __construct($it)
        {
            parent::__construct($it, self::LEAVES_ONLY);
        }

        function current()
        {
            return "<td style='width:150px;border:1px solid black;'>" . parent::current() . "</td>";
        }

        function beginChildren()
        {
            echo "<tr>";
        }

        function endChildren()
        {
            echo "</tr>" . "\n";
        }
    }

    $stmt = $conn->prepare("SELECT $what FROM $tablename");
    $stmt->execute();

    try {
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        foreach (new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k => $v) {
            echo $v;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    echo "</table>\n";
}

function getData($tableName, $what, $where = [], $input = [], $etc = "")
{
    global $conn;
    $sql = "SELECT $what FROM $tableName";
    if (count($where) > 0) {
        $sql .= " WHERE";
    }
    // echo $sql;
    $first = true;
    foreach ($where as $value) {
        if ($first) {
            $first = false;
        } else {
            $sql .= ",";
        }
        $sql .= " " . $value . "=:" . $value;
    }
    $query = $conn->prepare($sql);
    foreach ($where as $key => $value) {
        $query->bindParam(":" . $value, $input[$key], PDO::PARAM_STR);
    }
    try {
        $query->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    return $query;
}

function updateData($tableName, $what, $with, $where = [], $input = [])
{
    global $conn;
    $sql = "UPDATE $tableName SET ";
    $first = true;
    foreach ($what as $value) {
        if ($first) {
            $first = false;
        } else {
            $sql .= ",";
        }
        $sql .= " " . $value . "=:" . $value;
    }
    if (count($where) > 0) {
        $sql .= " WHERE";
    }
    $first = true;
    foreach ($where as $value) {
        if ($first) {
            $first = false;
        } else {
            $sql .= ",";
        }
        $sql .= " " . $value . "=:" . $value;
    }
    $query = $conn->prepare($sql);
    foreach ($what as $key => $value) {
        $query->bindParam(":" . $value, $with[$key], PDO::PARAM_STR);
    }
    foreach ($where as $key => $value) {
        $query->bindParam(":" . $value, $input[$key], PDO::PARAM_STR);
    }
    try {
        // echo $sql;
        $query->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    return $query;
}

function deleteData($tableName, $where, $input, $cmp = "=")
{
    global $conn;
    $sql = "DELETE FROM $tableName WHERE";
    foreach ($where as $key => $value) {
        $sql .= " " . $value . $cmp . ":" . $value;
    }
    $query = $conn->prepare($sql);
    foreach ($where as $key => $value) {
        $query->bindParam(":" . $value, $input[$key], PDO::PARAM_STR);
    }
    try {
        $query->execute();
        return true;
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    return false;
}

function getDataForJs($variable, $class, $tablename, $what, $where = [], $input = [], $operator = "AND")
{
    global $conn;

    $sql = "SELECT $what FROM $tablename";
    if (count($where) > 0) {
        $sql .= " WHERE";
    }
    foreach ($where as $key => $value) {
        if ($key != 0) {
            $sql .= " " . $operator;
        }
        $sql .= " " . $value . "=:" . $value;
    }
    // print ($sql);
    $query = $conn->prepare($sql);
    foreach ($where as $key => $value) {
        $query->bindParam(":" . $value, $input[$key], PDO::PARAM_STR);
    }

    try {
        $query->execute();
        $result = $query->setFetchMode(PDO::FETCH_ASSOC);
        $data = $query->fetchAll();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return;
    }

    $numItems = count($data);
    $i = 0;

    echo "<script src=\"data:text/javascript;base64,";


    $result = "const " . $variable . " = ";
    if ($variable != "userIdentifier") {
        $result .= "[";
    }
    foreach ($data as $vNode) {
        $result .= "new " . $class . "(";
        // echo "new " . $tablename . "(";
        $numVNodes = count($vNode);
        $j = 0;
        foreach ($vNode as $vNodeData) {
            // echo "\"";
            $result .= "\"";
            // echo htmlspecialchars($vNodeData);
            $result .= htmlspecialchars($vNodeData);
            // echo "\"";
            $result .= "\"";

            if (++$j !== $numVNodes) {
                $result .= ",";
                // echo ",";
            }
        }
        // echo ")";
        $result .= ")";
        if (++$i !== $numItems) {
            // echo ",";
            $result .= ",";
        }
    }
    // $result .= "]";
    if ($variable != "userIdentifier") {
        $result .= "]";
    }

    echo base64_encode($result);

    echo "\"></script>\n";
    // echo '<script src="data:text/javascript;base64,YWxlcnQoJ0hlbGxvIHdvcmxkIScpOw=="
    //     defer></script>';
}

function getDataForJson($tablename, $what, $where, $input)
{
    global $conn;
    $sql = "SELECT $what FROM $tablename WHERE";
    foreach ($where as $key => $value) {
        $sql .= " " . $value . "=:" . $value;
    }
    $query = $conn->prepare($sql);
    foreach ($where as $key => $value) {
        $query->bindParam(":" . $value, $input[$key], PDO::PARAM_STR);
    }

    try {
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        return;
    }

    return json_encode($result[0]);
}

function sessionIsValid()
{
    if (!isset($_SESSION["logged"]) || !isset($_SESSION["uuid"])) {
        return false;
    }
    try {
        global $conn;
        deleteData("vSessions", ["validUntil"], [floor(microtime(true) * 1000)], "<");

        $query = getData("vSessions", "validUntil", ["vSession"], [$_SESSION["uuid"]]);
        $results = $query->fetchAll();

        if (count($results) > 0) {
            return true;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    session_destroy();
    return false;
}

function sessionSet($username)
{
    $_SESSION["logged"] = true;
    $_SESSION["uuid"] = trim(newUuid());

    $query = getData("users", "uuid", ["username"], [$username]);
    $results = $query->fetchAll();

    if (count($results) != 1) {
        return false;
    }

    $_SESSION["userUuid"] = $results[0]["uuid"];

    global $conn;
    $sql = "INSERT INTO vSessions (vSession,user,validUntil) VALUES (?,?,?)";
    $query = $conn->prepare($sql);
    $query->execute(array($_SESSION["uuid"], $username, (floor(microtime(true) * 1000) + 8 * 60 * 60 * 1000)));
    return true;
}

function userExist($username)
{
    try {
        $query = getData("users", "uuid", ["username"], [$username]);
        $data = $query->fetchAll();
        foreach ($data as $user) {
            $_SESSION["uuid"] = $user["uuid"];
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    if ($query->rowCount() > 0) {
        return true;
    }
    return false;
}

function newUser($username, $password)
{
    global $conn;
    $sql = "INSERT INTO users (uuid, username, icon, settings, passwordHash, role) VALUES (?,?,?,?,?,?)";
    $query = $conn->prepare($sql);

    $userUuid = newUuid();
    $username = htmlspecialchars($_POST["username"]);
    $icon = "https://api.dicebear.com/9.x/identicon/svg?seed=" . htmlspecialchars($_POST["username"]) . "&rowColor=ffb300,fdd835,fb8c00,f4511e,e53935,d81b60,c0ca33,7cb342,FF4FE9,FFBD4F,4FFF65";
    $settings = '{"CssNavbarHeigh": "43px", "CssAppControlsSize": "13px", "CssAppControlsExtra": "9px", "CssNavbarTransparency": "0.8"}';
    $passwordHash = password_hash(htmlspecialchars($password), PASSWORD_DEFAULT);
    
    $adminUsers = getData("users", "role", ["role"], [100]);
    $adminUsers->fetchAll();
    if ($adminUsers->rowCount() > 1) {
        $role = 000;
    } else {
        $role = 100;
    }


    $query->execute(array($userUuid, $username, $icon, $settings, $passwordHash, $role));
    createDefaultFiles($userUuid);

    $_SESSION["uuid"] = $userUuid;
}

function createDefaultFiles($ownerUuid)
{
    // TODO: sloučit data s js a přidávat /user/data/

    global $conn;
    $sql = "INSERT INTO vNodes (uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions, name, description, size, data, icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $timestamp = floor(microtime(true) * 1000);

    $query = $conn->prepare($sql);
    $query->execute(array($ownerUuid, "root", null, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Základní složka", "", filesize(dirname(__FILE__) . "/user-data/defaults/sample.pdf") + filesize(dirname(__FILE__) . "/user-data/defaults/Nový textový dokument.txt"), '{"data":[]}', null));
    mkdir(dirname(__FILE__) . "/user-data/" . $ownerUuid . "/");

    $query = $conn->prepare($sql);
    $desktopUuid = newUuid();
    $query->execute(array($desktopUuid, "desktop", $ownerUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Plocha", "Obsahuje soubory a složky na ploše", filesize(dirname(__FILE__) . "/user-data/defaults/sample.pdf") + filesize(dirname(__FILE__) . "/user-data/defaults/Nový textový dokument.txt"), '{"data":["vComputer://' . $ownerUuid . '/"]}', null));
    mkdir(dirname(__FILE__) . "/user-data/" . $ownerUuid . "/" . $desktopUuid . "/");

    $query = $conn->prepare($sql);
    $documentsUuid = newUuid();
    $query->execute(array($documentsUuid, "documents", $ownerUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Dokumenty", "Složka pro ukládání dokumentů", 0, '{"data":["vComputer://' . $ownerUuid . '/"]}', null));
    mkdir(dirname(__FILE__) . "/user-data/" . $ownerUuid . "/" . $documentsUuid . "/");

    $query = $conn->prepare($sql);
    $imagesUuid = newUuid();
    $query->execute(array($imagesUuid, "images", $ownerUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Obrázky", "Složka pro ukládání obrázků", 0, '{"data":["vComputer://' . $ownerUuid . '/"]}', null));
    mkdir(dirname(__FILE__) . "/user-data/" . $ownerUuid . "/" . $imagesUuid);

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Tento Počítač", "Umístění: Tento Počítač", 0, '{"data":["vComputer://"]}', null));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Administrace", "Doktupné pouze pro administrátory", 0, '{"data":["admin://"]}', null));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":true}', "Minecraft", "Online verze hry minecraft", 0, '{"data":["games://minecraft"]}', null));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Ice Hockey", "Svině klouzavý", 0, '{"data":["games://ice-hockey"]}', null));

    copy(dirname(__FILE__) . "/user-data/defaults/Nový textový dokument.txt", dirname(__FILE__) . "/user-data/" . $ownerUuid . "/" . $desktopUuid . "/Nový textový dokument.txt");
    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "file", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":true}', "Nový textový dokument.txt", "Typ: Textový dokument", filesize(dirname(__FILE__) . "/user-data/defaults/Nový textový dokument.txt"), '{"data":["vComputer://' . $desktopUuid . '/"]}', null));

    copy(dirname(__FILE__) . "/user-data/defaults/sample.pdf", dirname(__FILE__) . "/user-data/" . $ownerUuid . "/" . $desktopUuid . "/sample.pdf");
    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "file", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":true}', "sample.pdf", "Typ: PDF dokument", filesize(dirname(__FILE__) . "/user-data/defaults/sample.pdf"), '{"data":["vComputer://' . $desktopUuid . '/"]}', null));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, $timestamp, $timestamp, $timestamp, $ownerUuid, '{"canDelete":false}', "Mapy", "OpenStreetMaps based map app", 0, '{"data":["https://facilmap.org/#9/50.1443/14.4470/Lima"]}', "https://cdn-icons-png.flaticon.com/512/235/235861.png"));
}

function loginAuth($username, $password)
{
    $query = getData("users", "passwordHash", ["username"], [$username]);
    $data = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($query->rowCount() == 1) {
        foreach ($data as $row) {
            if (password_verify(htmlspecialchars($password), $row["passwordHash"])) {
                return true;
            }
        }
    }
    return false;
}