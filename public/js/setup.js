"use strict";

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "uuid"), new dbShape("user", Object.keys(new user()), "uuid")];

const iframesHelper = {
    iframeMouseOver: false,
    lastIframe: null
}

let shutdown = false;

const resizingElementsPrefixes = ["n", "e", "s", "w", "nw", "ne", "sw", "se"];

const sizePrefixes = {
    "B": 1,
    "kB": 1000,
    "MB": 1000 * 1000,
    "GB": 1000 * 1000 * 1000,
    "TB": 1000 * 1000 * 1000 * 1000
};

const months = [
    "leden",
    "únor",
    "březen",
    "duben",
    "květen",
    "červen",
    "červenec",
    "srpen",
    "září",
    "říjen",
    "listopad",
    "prosinec"
];

// document.addEventListener("load", () => {
//     const input = document.querySelector("input[type=file]");
//     const uploadElement = document.querySelector(".uploading");
// });

const input = document.querySelector("input[type=file]");
const uploadElement = document.querySelector(".uploading");

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();