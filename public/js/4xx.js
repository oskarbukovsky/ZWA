"use strict";

/**
 * @file 4xx error handling script
 * @author Jan Oskar Bukovský
 */

// If the error code is 401, the session has timed out and act upon it
if (getParam("code") == "401") {
    window.top.postMessage(["sessionTimeout"]);
    if (!pageInIframe()) {
        window.location.assign("index.php?event=session-timeout")
    }
}

// Propagate click to the main app
window.addEventListener("click", ()=>{
    window.top.postMessage(["focus"]);
});