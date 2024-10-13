"use strict";

const DEBUG = true;

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("user", Object.keys(new user()), "uuid")];

const myConfObj = {
    iframeMouseOver: false,
    lastIframe: null
}

const resizingElementsPrefixes = ["nw", "ne", "sw", "se", "n", "e", "s", "w"];

const input = document.querySelector('input[type=file]');

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
