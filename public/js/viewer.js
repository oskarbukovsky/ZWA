"use strict";

/**
 * @file Viewer page script
 * @author Jan Oskar Bukovský
 */

// Propagate click to the main app
window.addEventListener("click", ()=>{
    window.top.postMessage(["focus"]);
});