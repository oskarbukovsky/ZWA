"use strict";

window.addEventListener("click", ()=>{
    window.top.postMessage(["focus"]);
});