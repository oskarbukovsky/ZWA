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

        if (x > windows.clientWidth) {
            x = windows.clientWidth;
        }
        if (y > windows.clientHeight) {
            y = windows.clientHeight;
        }
        cl(x, y);
    },
    changeEvent: function (val) {
        let app = this.element;
        while (!app?.classList?.contains("windows-app")) {
            if (app === null) {
                return false;
            } else {
                app = app.parentElement;
            }
        }
        if (val) {
            cl("true: ", app);
            app.classList.add("active");
            app.classList.add("resizing");
            window.addEventListener("mousemove", this.resizingEvent);
        } else {
            cl("false: ", app);
            app.classList.remove("resizing");
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