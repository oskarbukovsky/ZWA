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

    static NoPropagation(event) {
        event.stopPropagation();
    }
}

window.addEventListener('blur', () => {
    if (myConfObj.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectDesktopIcon();
        deselectAllApps();
        closeAllDesktopContextMenus();
        uploadElement.classList.remove("upload");
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
    uploadElement.classList.remove("upload");
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

desktop.addEventListener("dragover", (event) => {
    event.preventDefault();
});

desktop.addEventListener("dragenter", (event) => {
    event.preventDefault();
    uploadElement.classList.add("upload");
});
uploadElement.addEventListener('dragleave', (event) => {
    event.preventDefault();
    uploadElement.classList.remove("upload");
});

desktop.addEventListener("drop", (event) => {
    uploadElement.classList.remove("upload");
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
        fileUpload.files = files;
        handleFileUpload(files)
    }
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key == "a" || event.key == "A")) {
        deselectDesktopIcon();
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectAllApps();
        closeAllDesktopContextMenus();
        desktop.querySelectorAll(".icon").forEach((element) => {
            element.classList.add("icon-selected");
        });
    }
});

function desktopIconOpener(element) {
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

function desktopIconContextMenu(element, node) {
    element.addEventListener('contextmenu', function (event) {
        cl("Open ContextMenu from Desktop\n", element);
        
        deselectDesktopIcon();
        element.classList.add("icon-selected");

        event.preventDefault();
        const tooltip = element.querySelector(".icon-tooltip");
        if (tooltip) {
            tooltip.classList.remove("active");
            setTimeout(() => tooltip.remove(), 250);
        }
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectAllApps();
        closeAllDesktopContextMenus();

        const container = createElement("div", new ClassList("context-menu", "open", "no-select"));

        const open = createElement("span", new TextContent("Otevřít"), new AppendTo(container));
        open.addEventListener("click", () => appOpen(node));
        const edit = createElement("span", new TextContent("Upravit"), new AppendTo(container));
        const print = createElement("span", new TextContent("Tisknout"), new AppendTo(container));
        print.addEventListener("click", () => {
            const iframe = createElement("iframe", new ClassList("hidden"), new Src(getDestination(node)), new AppendTo(document.body), new ElementEvent("afterprint", () => self.close));
            cl("Printing: ", iframe);
            iframe.contentWindow.print();
        });
        const hr1 = createElement("hr", new AppendTo(container));

        const copy = createElement("span", new TextContent("Kopírovat"), new AppendTo(container));
        const download = createElement("span", new TextContent("Stáhnout"), new AppendTo(container));

        const hr2 = createElement("hr", new AppendTo(container));

        const remove = createElement("span", new TextContent("Odstranit"), new AppendTo(container));
        const rename = createElement("span", new TextContent("Přejmenovat"), new AppendTo(container));

        const hr3 = createElement("hr", new AppendTo(container));

        const properties = createElement("span", new TextContent("Vlastnosti"), new AppendTo(container));

        container.style.left = event.clientX + 1 + "px";
        element.appendChild(container);
        let bottom = desktop.getBoundingClientRect().height - event.clientY + 1;
        if (container.getBoundingClientRect().height >= event.clientY) {
            bottom = desktop.getBoundingClientRect().height - container.getBoundingClientRect().height - 1;
        }
        container.style.bottom = bottom + "px";
    });
}

function desktopIconSelect(element) {
    element.addEventListener("click", (event) => {
        if (!is_key_down("Control")) {
            deselectDesktopIcon();
        }
        element.classList.toggle("icon-selected");
        closeDesktopCalendar();
        closeAllDesktopContextMenus();
        event.stopPropagation();
    })
}