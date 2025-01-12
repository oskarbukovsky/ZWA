"use strict";

/**
 * @file Viewer page script
 * @author Jan Oskar Bukovský
 */

// Propagate click to the main app
window.addEventListener("click", () => {
    window.top.postMessage(["focus"]);
});

// Focus the textarea for editing on window load
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("textarea").focus();
});

// Handles file saving
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("edit") == "true") {
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            cl('CTRL + S');
            addNotification({ "head": urlParams.get("uuid"), "body": "Soubor byl uložen" }, false, null, "info");
        }
    });
}