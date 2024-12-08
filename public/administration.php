<?php
require("db.php");
if (!sessionIsValid()) {
    header("Location: error.php?code=403");
    die();
}
// TODO: remove comment
// if ($_SERVER['REQUEST_METHOD'] === 'GET') {
//     header("Location: error.php?code=403");
//     die();
// }
?>

<!DOCTYPE html>
<html lang="cs">

<head>
    <title>Administrace</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/administration/administration.css">

    <link rel="icon" href="media/favicon.png" type="image/gif" sizes="256x256">
    <meta name="author" content="Jan Oskar Bukovský">
    <meta name="description" content="ZWA project">
    <meta name="Content-Type" content="text/html">

    <script src="js/classes.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/setup.js"></script>

    <script src="js/administration.js"></script>
</head>

<body>
    <table>
        <thead>
            <tr>
                <th>Uživatelské jméno</th>
                <th>Uuid</th>
                <th>Role</th>
                <th>Resetovat heslo</th>
                <th>Povýšení na administrátora</th>
                <th>Degradace na uživatele</th>
                <th>Smazat</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $roles = ["000" => "Uživatel", "100" => "Administrátor"];
            try {
                $query = getData("users", "username,uuid,role");
                $data = $query->fetchAll();
                foreach ($data as $user) {
                    print ("<tr>");
                    print ('<td class="username">' . htmlspecialchars($user["username"]) . '</td>');
                    print ('<td class="uuid" title="' . htmlspecialchars($user["uuid"]) . '">' . htmlspecialchars($user["uuid"]) . '</td>');
                    print ('<td class="role">' . htmlspecialchars($roles[$user["role"]]) ?? htmlspecialchars($user["role"]) . '</td>');
                    print ('<td class="reset"><button>Resetovat heslo</button></td>');
                    print ('<td class="promote"><button>Povýšit</button></td>');
                    print ('<td class="demote"><button>Degradovat</button></td>');
                    print ('<td class="delete"><button>Smazat</button></td>');
                    print ("</tr>");
                    print ("<tr>");
                    print ('<td class="username">' . htmlspecialchars($user["username"]) . '</td>');
                    print ('<td class="uuid" title="' . htmlspecialchars($user["uuid"]) . '">' . htmlspecialchars($user["uuid"]) . '</td>');
                    print ('<td class="role">' . htmlspecialchars($roles[$user["role"]]) ?? htmlspecialchars($user["role"]) . '</td>');
                    print ('<td class="reset"><button>Resetovat heslo</button></td>');
                    print ('<td class="promote"><button>Povýšit</button></td>');
                    print ('<td class="demote"><button>Degradovat</button></td>');
                    print ('<td class="delete"><button>Smazat</button></td>');
                    print ("</tr>");
                    print ("<tr>");
                    print ('<td class="username">' . htmlspecialchars($user["username"]) . '</td>');
                    print ('<td class="uuid" title="' . htmlspecialchars($user["uuid"]) . '">' . htmlspecialchars($user["uuid"]) . '</td>');
                    print ('<td class="role">' . htmlspecialchars($roles[$user["role"]]) ?? htmlspecialchars($user["role"]) . '</td>');
                    print ('<td class="reset"><button>Resetovat heslo</button></td>');
                    print ('<td class="promote"><button>Povýšit</button></td>');
                    print ('<td class="demote"><button>Degradovat</button></td>');
                    print ('<td class="delete"><button>Smazat</button></td>');
                    print ("</tr>");
                    print ("<tr>");
                    print ('<td class="username">' . htmlspecialchars($user["username"]) . '</td>');
                    print ('<td class="uuid" title="' . htmlspecialchars($user["uuid"]) . '">' . htmlspecialchars($user["uuid"]) . '</td>');
                    print ('<td class="role">' . htmlspecialchars($roles[$user["role"]]) ?? htmlspecialchars($user["role"]) . '</td>');
                    print ('<td class="reset"><button>Resetovat heslo</button></td>');
                    print ('<td class="promote"><button>Povýšit</button></td>');
                    print ('<td class="demote"><button>Degradovat</button></td>');
                    print ('<td class="delete"><button>Smazat</button></td>');
                    print ("</tr>");
                    print ("<tr>");
                    print ('<td class="username">' . htmlspecialchars($user["username"]) . '</td>');
                    print ('<td class="uuid" title="' . htmlspecialchars($user["uuid"]) . '">' . htmlspecialchars($user["uuid"]) . '</td>');
                    print ('<td class="role">' . htmlspecialchars($roles[$user["role"]]) ?? htmlspecialchars($user["role"]) . '</td>');
                    print ('<td class="reset"><button>Resetovat heslo</button></td>');
                    print ('<td class="promote"><button>Povýšit</button></td>');
                    print ('<td class="demote"><button>Degradovat</button></td>');
                    print ('<td class="delete"><button>Smazat</button></td>');
                    print ("</tr>");
                }
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
            ?>
        </tbody>
    </table>
</body>

</html>