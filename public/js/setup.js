"use strict";

const DEBUG = true;

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("user", Object.keys(new user()), "uuid")];

const myConfObj = {
    iframeMouseOver: false,
    lastIframe: null
}

const resizingElementsPrefixes = ["n", "e", "s", "w", "nw", "ne", "sw", "se"];

const input = document.querySelector('input[type=file]');

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

        let boundingBox = appResizing.app.getBoundingClientRect();

        if (!appResizing.grip) {
            cl("no grip");
            return;
        }
        switch (appResizing.grip) {
            case "n":
                cl("nahoře", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.top = y + "px";
                appResizing.app.style.height = boundingBox.height - y + "px";
                break;
            case "e":
                cl("pravá", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.width = x - boundingBox.left + "px";
                break;
            case "s":
                cl("dole", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.height = y - boundingBox.top + "px";
                break;
            case "w":
                cl("levá", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.width = (boundingBox.left - x) + boundingBox.width + "px";
                appResizing.app.style.left = x + "px";
                // cl("appResizing.app.style.width: ", appResizing.app.style.width);
                break;
            case "nw":
                cl("levá nahoře", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.top = appResizing.y + "px";
                appResizing.app.style.left = appResizing.x + "px";
                break;
            case "ne":
                cl("pravá nahoře", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.top = appResizing.y + "px";
                appResizing.app.style.width = appResizing.x - parseInt(appResizing.app.style.left) + "px";
                break;
            case "sw":
                cl("levá dole", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.height = appResizing.y - parseInt(appResizing.app.style.top) + "px";
                appResizing.app.style.left = appResizing.x + "px";
                break;
            case "se":
                cl("pravá dole", boundingBox, "\n", `${x}:${y}`);
                appResizing.app.style.height = appResizing.y - parseInt(appResizing.app.style.top) + "px";
                appResizing.app.style.width = appResizing.x - parseInt(appResizing.app.style.left) + "px";
                break;
            default:
                cl("Error");
                break;
        }
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
            cl("true: ", this.app, " this.grip: ", this.grip);
            this.app.classList.add("active");
            this.app.classList.add("resizing");
            window.addEventListener("mousemove", this.resizingEvent);
        } else {
            cl("false: ", this.app);
            this.app.classList.remove("resizing");
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