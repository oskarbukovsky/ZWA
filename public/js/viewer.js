"use strict";

/**
 * @file Viewer page script
 * @author Jan Oskar Bukovský
 */

window.addEventListener("click", ()=>{
    window.top.postMessage(["focus"]);
});