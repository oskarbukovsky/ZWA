"use strict";

class ElementEvents {
    static appIframeMouseOver = (event) => {
        myConfObj.iframeMouseOver = true;
        myConfObj.lastIframe = event.target;
    };

    static appIframeMouseOut = () => {
        myConfObj.iframeMouseOver = false;
        myConfObj.lastIframe = null;
    };

    static navbarIconClick = (event) => {
        setTimeout(() => { }, 20);
        const icon = bubbleToClass(event, "navbar-icon");
        const id = icon.dataset.id;
        const selector = windows.querySelector('[data-id="' + id + '"]');
        if (icon.classList.contains("active")) {
            deselectAllApps();
            selector.classList.add("minimized");
        } else {
            selector.classList.remove("minimized");
            selectApp(id);
            selector.style.zIndex = getLowestMaxAppZIndex();
        }
    };
}

window.addEventListener('blur', () => {
    if (myConfObj.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectDesktopIcon();
        deselectAllApps();
        closeAllDesktopContextMenus();
        let app = myConfObj.lastIframe;
        while (!app?.classList?.contains("windows-app")) {
            app = app.parentElement;
            if (app === null) {
                return false;
            }
        }
        app.classList.add("active");
        navbar.querySelector('[data-id="' + app.dataset.id + '"]').classList.add("active");
        app.style.zIndex = getLowestMaxAppZIndex();
    }
});

window.addEventListener("click", (event) => {
    if (!(bubbleToClass(event, "navbar-menu") || bubbleToClass(event, "main-menu"))) {
        closeMainMenu();
    }
    if (!(bubbleToClass(event, "search-menu") || bubbleToClass(event, "searchbar"))) {
        closeSearchbarMenu();
    }
    if (!(bubbleToClass(event, "calendar-container") || bubbleToClass(event, "datetime"))) {
        closeDesktopCalendar();
    }
    // bubbleToClass(event, "windows-app")?.classList?.remove("active");
    deselectDesktopIcon();
    if (!bubbleToClass(event, "windows-app") && !bubbleToClass(event, "navbar-icon")) {
        deselectAllApps();
    }
    if (!bubbleToClass(event, "context-menu")) {
        closeAllDesktopContextMenus();
    }
})

navbar.querySelector(".navbar-menu").addEventListener("click", (event) => {
    if (event.target != navbar.querySelector(".navbar-menu > .main-menu")) {
        navbar.querySelector(".navbar-menu > .main-menu").classList.toggle("open");
    }
});

navbar.querySelector(".navbar-search .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-search > .search-menu").classList.toggle("open");
});

navbar.querySelector(".navbar-time .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-time > .calendar-container").classList.toggle("open");
});

navbar.querySelector(".navbar-minimize").addEventListener("click", () => {
    // cl(".navbar-minimize");
    deselectAllApps();
    windows.querySelectorAll(".windows-app").forEach((app) => {
        app.classList.add("minimized");
    });
});

document.querySelectorAll(".calendar-navigation span").forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        if (month < 0 || month > 11) {
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        }
        manipulateCalendar();
    });
});

const appIframeLoaded = () => {
    cl("loaded iframe");
    navbarHolder.classList.add("running");
    navbarHolder.classList.add("active");
};

window.onmessage = function (event) {
    cl("receivedFromIframe: ", event);
};

addEventListener("resize", () => {
    appResizing.windowResize();
});

function appResizeDown() {
    appResizing.status = [true, this];
}
function appResizeUp() {
    appResizing.status = [false];
}

window.document.body.addEventListener("dragover", (event) => {
    event.preventDefault();
});

window.document.body.addEventListener("dragenter", (event) => {
    event.preventDefault();
    uploadElement.classList.add("upload");
});
uploadElement.addEventListener('dragleave', (event) => {
    event.preventDefault();
    uploadElement.classList.remove("upload");
});

window.document.body.addEventListener("drop", (event) => {
    uploadElement.classList.remove("upload");
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
        fileUpload.files = files;
        handleFileUpload(files)
    }
});

function desktopIconOpen(element) {
    element.addEventListener("dblclick", (event) => {
        closeAllDesktopContextMenus();
        // cl("Open Window from Desktop\n", holder);
        let dbStore = localDatabase.getStore("vNodes");

        let idRequest = dbStore.get(element.childNodes[1].dataset.id);
        // cl("holder.childNodes[1].dataset.id: ", holder.childNodes[1].dataset.id);
        idRequest.onsuccess = function () {
            let data = idRequest.result;
            // cl("get success: ", data);
            data.timeRead = Date.now();

            let putRequest = dbStore.put(data);
            putRequest.onsuccess = function () {
                // cl("put success: ", putRequest);
            }

            //TODO Sync with server

            appOpen(data);
        }
        event.preventDefault();
    });
}

function desktopIconEditName(element) {
    element.addEventListener("dblclick", (event) => {
        closeAllDesktopContextMenus();
        let element = event.toElement;
        if (element.readOnly) {
            textSelect(element, 0, element.value.lastIndexOf('.'))
            element.readOnly = !element.readOnly
        }
        event.stopPropagation();
    });
    element.addEventListener("focusout", (event) => {
        // cl("srcElement deprecated; Event: ", event)
        event.target.readOnly = true;
        textDeSelect()
    });
}

function deselectDesktopIcon() {
    document.querySelectorAll("figure.icon.icon-selected").forEach((el) => {
        el.classList.remove("icon-selected");
    });
    // navbar.querySelector(".navbar-time").children[0].classList.remove("open");
    // navbar.querySelector(".navbar-search").children[0].classList.remove("open");
}

const is_key_down = (() => {
    const state = {};
    window.addEventListener('keyup', (event) => {
        state[event.key] = false;
        // cl(e.key + " " + state[e.key]);
    });
    window.addEventListener('keydown', (event) => {
        state[event.key] = true;
        // cl(e.key + " " + state[e.key]);
    });
    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

function desktopIconSelect(element) {
    element.addEventListener("click", (event) => {
        if (!is_key_down('Control')) {
            deselectDesktopIcon();
        }
        element.classList.toggle("icon-selected");
        closeDesktopCalendar();
        closeAllDesktopContextMenus();
        event.stopPropagation();
    })
}