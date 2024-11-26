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

let appResizing = {
    top: null,
    left: null,
    width: null,
    height: null,
    _status: false,
    element: null,
    grip: null,
    app: null,
    maxX: null,
    maxY: null,
    boundingBox: null,
    windowResize: function () {
        const defaultAppsSizes = document.querySelector("#windows").getBoundingClientRect();
        this.maxX = defaultAppsSizes.width;
        this.maxY = defaultAppsSizes.height;
    },
    resizingEvent: function (event) {
        let x = event.pageX < 0 ? 0 : event.pageX;
        let y = event.pageY < 0 ? 0 : event.pageY;

        if (x > appResizing.maxX) {
            x = appResizing.maxX;
        }
        if (y > appResizing.maxY) {
            y = appResizing.maxY;
        }

        if (!appResizing.grip) {
            // cl("no grip");
            return;
        }
        let headerBoundingBox = appResizing.app.querySelector(".app-header").getBoundingClientRect();
        appResizing.grip.split("").forEach(grip => {
            switch (grip) {
                case "n":
                    // cl("nahoře", appResizing.boundingBox, "\n", `${x}:${y}`);
                    let height = (appResizing.boundingBox.top - y) + appResizing.boundingBox.height - 2;
                    if (height < 300) {
                        height = 300
                    }
                    let top = y;
                    if (y + 303 + headerBoundingBox.height > appResizing.boundingBox.bottom) {
                        top = appResizing.boundingBox.bottom - headerBoundingBox.height - 303;
                    }
                    appResizing.app.style.top = top + "px";
                    appResizing.app.style.height = height + "px";
                    break;
                case "e":
                    // cl("pravá", appResizing.boundingBox, "\n", `${x}:${y}`);
                    appResizing.app.style.width = x - appResizing.boundingBox.left + "px";
                    break;
                case "s":
                    // cl("dole", appResizing.boundingBox, "\n", `${x}:${y}`);
                    appResizing.app.style.height = y - appResizing.boundingBox.top + "px";
                    break;
                case "w":
                    // cl("levá", appResizing.boundingBox, "\n", `${x}:${y}`);
                    let width = (appResizing.boundingBox.left - x) + appResizing.boundingBox.width - 2;
                    if (width < 400) {
                        width = 400
                    }
                    let left = x;
                    if (x + 402 > appResizing.boundingBox.right) {
                        left = appResizing.boundingBox.right - 402;
                    }
                    appResizing.app.style.left = left + "px";
                    appResizing.app.style.width = width + "px";
                    break;
                // case "nw":
                default:
                    cl("Error");
                    break;
            }
        });
    },
    changeEvent: function (val) {
        let app = this.element;
        if (app) {
            this.grip = app.classList[1].split("-grip")[0];
            while (!app?.classList?.contains("windows-app")) {
                if (app === null) {
                    return false;
                } else {
                    app = app.parentElement;
                }
            }
            this.app = app;
        }
        if (val) {
            // cl("true: ", this.app, " this.grip: ", this.grip);
            this.boundingBox = this.app.getBoundingClientRect();
            deselectAllApps();
            this.app.classList.add("active");
            navbar.querySelector('[data-uuid="' + this.app.dataset.uuid + '"]').classList.add("active");
            this.app.classList.add("resizing");
            this.app.style.zIndex = getLowestMaxAppZIndex();
            window.addEventListener("mousemove", this.resizingEvent);
        } else {
            // cl("false: ", this.app);
            if (this.app) {
                this.app.classList.remove("resizing");
            }
            window.removeEventListener("mousemove", this.resizingEvent);
        }
    },
    get status() {
        return this._status;
    },
    set status(parameters) {
        let newValue = parameters[0];
        let localThis = parameters[1];
        this._status = newValue;
        if (localThis && localThis.classList.contains("resizable")) {
            this.element = localThis;
        }
        this.changeEvent(newValue);
    }
};