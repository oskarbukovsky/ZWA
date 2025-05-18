"use strict";

/**
 * This file setups some global variables
 * @file Utility setup file for desktop app
 * @author Jan Oskar Bukovský
 */

/**
 * Variable for the indexedDb things
 * @constant {IDBDatabase}
 */
let localDatabase

/**
 * Constant for the name of the database.
 * @constant {string}
 */
const dbName = "ZWA";

/**
 * indexedDb structure structure
 * @constant {array}
 */
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "uuid"), new dbShape("user", Object.keys(new user()), "uuid")];

const iframesHelper = {
    iframeMouseOver: false,
    lastIframe: null
}

let shutdown = false;

const resizingElementsPrefixes = ["n", "e", "s", "w", "nw", "ne", "sw", "se"];

// TODO: add also kiB prefixes
// Prefixes for the size of the file
const sizePrefixes = {
    "B": 1,
    "kB": 1000,
    "MB": 1000 * 1000,
    "GB": 1000 * 1000 * 1000,
    "TB": 1000 * 1000 * 1000 * 1000
};

//TODO: For i18n extension in the future
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

const input = document.querySelector("input[type=file]");
const uploadElement = document.querySelector(".uploading");

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();