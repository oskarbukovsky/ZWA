"use strict";

if (getParam("code") == "403") {
    window.top.postMessage(["sessionTimeout"]);
    if (!pageInIframe()) {
        window.location.assign("index.php?event=session-timeout")
    }
}