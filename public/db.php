<?php
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

function getData($tableName, $what, $where, $input)
{
    global $conn;
    $sql = "SELECT " . $what . " FROM " . $tableName . " WHERE";
    // echo $sql;
    foreach ($where as $key => $value) {
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

function deleteData($tableName, $where, $input)
{
    global $conn;
    $sql = "DELETE FROM " . $tableName . " WHERE";
    foreach ($where as $key => $value) {
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
}

function getDataForJs($class, $tablename, $what)
{
    global $conn;
    $query = $conn->prepare("SELECT $what FROM $tablename");

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


    $result = "const " . $tablename . " = [";
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
    $result .= "]";

    echo base64_encode($result);

    echo "\"></script>\n";
    // echo '<script src="data:text/javascript;base64,YWxlcnQoJ0hlbGxvIHdvcmxkIScpOw=="
    //     defer></script>';
}

function sessionIsValid()
{
    if (!isset($_SESSION["logged"]) || !isset($_SESSION["uuid"])) {
        return false;
    }
    try {
        global $conn;
        // $vSession = trim($_SESSION["uuid"]);
        // // $sql = "SELECT validUntil FROM sessions WHERE session=:value";
        // $sql = "SELECT * FROM vSessions WHERE vSession = :value";
        // $query = $conn->prepare($sql);
        // $query->bindParam(":value", $vSession, PDO::PARAM_STR);
        // $query->execute();
        
        $query = getData("vSessions", "validUntil", ["vSession"], [trim($_SESSION["uuid"])]);

        $result = $query->fetchAll();

        foreach ($result as $data) {
            if ($data["validUntil"] > time()) {
                return true;
            } else {
                deleteData("vSessions", ["vSession"], [trim($_SESSION["uuid"])]);
                return false;
            }
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
    $_SESSION['logged'] = false;
    $_SESSION['uuid'] = "";
    return false;
}

function sessionSet($username)
{
    $_SESSION['logged'] = true;
    $_SESSION['uuid'] = newUuid();

    global $conn;
    $sql = "INSERT INTO vSessions (vSession,user,validUntil) VALUES (?,?,?)";
    $query = $conn->prepare($sql);
    $query->execute(array($_SESSION["uuid"], $username, (time() + 8 * 60 * 60)));
}

function userExist($username)
{
    try {
        $query = getData("users", "uuid", ["username"], [$username]);
        $data = $query->fetchAll(PDO::FETCH_ASSOC);
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
    $icon = "https://api.dicebear.com/9.x/identicon/svg?seed=" . htmlspecialchars($_POST["username"]);
    $settings = '{"CssNavbarHeigh": "43px", "CssAppControlsSize": "13px", "CssAppControlsExtra": "9px", "CssNavbarTransparency": "0.8"}';
    $passwordHash = password_hash(htmlspecialchars($password), PASSWORD_DEFAULT);
    $role = 000;

    $query->execute(array($userUuid, $username, $icon, $settings, $passwordHash, $role));
    createDefaultFiles($userUuid);

    $_SESSION["uuid"] = $userUuid;
}

function createDefaultFiles($ownerUuid)
{
    global $conn;
    $sql = "INSERT INTO vNodes (uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions, name, description, data) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    $query = $conn->prepare($sql);
    $rootUuid = newUuid();
    $query->execute(array($rootUuid, "root", null, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Základní složka", "", '{"data":[]}'));

    $query = $conn->prepare($sql);
    $desktopUuid = newUuid();
    $query->execute(array($desktopUuid, "desktop", $rootUuid, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Plocha", "Obsahuje soubory a složky na ploše", '{"data":[]}'));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "documents", $rootUuid, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Dokumenty", "Složka pro ukládání dokumentů", '{"data":[]}'));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "images", $rootUuid, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Obrázky", "Složka pro ukládání obrázků", '{"data":[]}'));


    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Tento Počítač", "Umístění: Tento Počítač", '{"data":["vComputer://"]}'));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "link", $desktopUuid, time(), time(), time(), $ownerUuid, '{"canDelete":false}', "Administrace", "", '{"data":["admin://"]}'));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "file", $desktopUuid, time(), time(), time(), $ownerUuid, '{"canDelete":true}', "Nový textový dokument.txt", "Typ: Textový dokument", '{"data":[]}'));

    $query = $conn->prepare($sql);
    $query->execute(array(newUuid(), "file", $desktopUuid, time(), time(), time(), $ownerUuid, '{"canDelete":true}', "sample.pdf", "Typ: PDF dokument", '{"data":["/2/"]}'));
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