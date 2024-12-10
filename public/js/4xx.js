"use strict";

if (getParam("code") == "401") {
    window.top.postMessage(["sessionTimeout"]);
    if (!pageInIframe()) {
        window.location.assign("index.php?event=session-timeout")
    }
}

window.addEventListener("click", ()=>{
    window.top.postMessage(["focus"]);
});