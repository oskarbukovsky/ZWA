"use strict";

/**
 * @file 4xx error handling script
 * @author Jan Oskar Bukovský
 */

// Propagate click to the main app
window.addEventListener("click", () => {
    window.top.postMessage(["focus"]);
});

// Process error to next level
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (pageInIframe()) {
        if (urlParams.get("code") == "401") {
            window.top.postMessage(["sessionTimeout"]);
        }
    } else {
        setTimeout(() => {
            window.location.assign("index.php?event=error");
        }, 15000);
    }
});

