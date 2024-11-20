"use strict";

window.top.postMessage(["sessionTimeout"]);
if (!pageInIframe()) {
    window.location.assign("index.php?event=session-timeout")
}