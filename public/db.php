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

function getData($class, $tablename, $what)
{
    global $conn;
    $stmt = $conn->prepare("SELECT $what FROM $tablename");
    $stmt->execute();

    try {
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $data = $stmt->fetchAll();
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