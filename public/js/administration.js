"use strict";

/**
 * @file Administration page script
 * @author Jan Oskar Bukovský
 */

// Propagate click to the main app
window.addEventListener("click", () => {
    window.top.postMessage(["focus"]);
});

// Run the logic after the page is loaded
window.addEventListener("DOMContentLoaded", () => {
    // Process password reset buttons
    document.querySelectorAll("table > tbody > tr").forEach((element) => {
        element.querySelector(".reset>button").addEventListener("click", () => {
            let newPassword = prompt("Zadejte nové heslo uživateli " + element.querySelector(".username").textContent + ":");
            if (newPassword == null || newPassword == "") {
                alert("Operace zrušena");
            } else {
                const data = { "method": "userResetPassword", "uuid": element.querySelector(".uuid").textContent, "newPassword": newPassword };
                cl("|📗 Sending data:", data);
                ajax(data).then(response => {
                    if (response.status == "ok") {
                        addNotification({ "head": "Reset PW", "body": "Ok: \"" + response.details + "\"" }, false, null, "info");
                        alert("Změna hesla proběhla úspěšně");
                    } else {
                        addNotification({ "head": "Reset PW", "body": "Chyba: " + response.details }, false, null, "warning");
                        alert("Změna hesla selhala");
                    }
                });
            }
        });
        // Process promote buttons (admin)
        element.querySelector(".promote>button").addEventListener("click", () => {
            if (!confirm("Opravdu si přejete uživateli " + element.querySelector(".username").textContent + " změnit roli na Administrátora ?")) {
                alert("Operace zrušena");
            } else {
                const data = { "method": "userPromote", "uuid": element.querySelector(".uuid").textContent };
                cl("|📗 Sending data:", data);
                ajax(data).then(response => {
                    if (response.status == "ok") {
                        addNotification({ "head": "Promote", "body": "Ok: \"" + response.details + "\"" }, false, null, "info");
                        element.querySelector(".role>div").dataset.role = "admin";
                        alert("Uživatel " + element.querySelector(".username").textContent + " je nyní Administrátor");
                    } else {
                        addNotification({ "head": "Promote", "body": "Chyba: " + response.details }, false, null, "warning");
                        alert("Při přiřazování role Administrátora " + element.querySelector(".username").textContent + " nastala chyba!");
                    }
                });
            }
        });
        // Process demote buttons (user)
        element.querySelector(".demote>button").addEventListener("click", () => {
            if (!confirm("Opravdu si přejete uživateli " + element.querySelector(".username").textContent + " změnit roli na Uživatel ?")) {
                alert("Operace zrušena");
            } else {
                const data = { "method": "userDemote", "uuid": element.querySelector(".uuid").textContent };
                cl("|📗 Sending data:", data);
                ajax(data).then(response => {
                    if (response.status == "ok") {
                        addNotification({ "head": "Demote", "body": "Ok: \"" + response.details + "\"" }, false, null, "info");
                        element.querySelector(".role>div").dataset.role = "user";
                        alert("Uživatel " + element.querySelector(".username").textContent + " již není Administrátor");
                    } else {
                        addNotification({ "head": "Demote", "body": "Chyba: " + response.details }, false, null, "warning");
                        alert("Při odebírání role Administrátora " + element.querySelector(".username").textContent + " nastala chyba!");
                    }
                });
            }
        });
        // Process delete buttons (delete user with his data)
        element.querySelector(".delete>button").addEventListener("click", () => {
            if (!confirm("Opravdu si přejete smazat uživatele " + element.querySelector(".username").textContent + " a všechna jeho data?")) {
                alert("Operace zrušena");
            } else {
                const data = { "method": "userDelete", "uuid": element.querySelector(".uuid").textContent };
                cl("|📗 Sending data:", data);
                ajax(data).then(response => {
                    if (response.status == "ok") {
                        addNotification({ "head": "Delete", "body": "Ok: \"" + response.details + "\"" }, false, null, "info");
                        alert("Uživatel " + element.querySelector(".username").textContent + " byl úspěšně smazán");
                    } else {
                        addNotification({ "head": "Delete", "body": "Chyba: " + response.details }, false, null, "warning");
                        alert("Při mazání uživatele " + element.querySelector(".username").textContent + " nastala chyba!");
                    }
                });
            }
        });
    });
});