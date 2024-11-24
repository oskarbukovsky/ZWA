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
        const id = icon.dataset.uuid;
        const selector = windows.querySelector('[data-uuid="' + id + '"]');
        if (icon.classList.contains("active")) {
            deselectAllApps();
            selector.classList.add("minimized");
        } else {
            selector.classList.remove("minimized");
            selectApp(id);
        }
    };

    static fileCreate = (event) => {
        cl("|📘 Creating new file vNode");
        ajax({ "method": "create", "type": "file", "parent": "file" }).then(response => {
            if (response.status == "ok") {
                addNotification({ "head": "Vytvoření", "body": "Ok: " + Object.keys(response.item)[0] }, false, null, "info");
            } else {
                addNotification({ "head": "Vytvoření", "body": "Chyba: " + response.details }, false, null, "warning");
            }
        });
    }

    static folderCreate = (event) => {
        cl("|📘 Creating new folder vNode");
        localDatabase.getColumn("vNodes", "type", "desktop").then(desktopNode => {
            const data = { "method": "create", "type": "folder", "parent": desktopNode[0].uuid };
            cl("|📗 Sending data:", data);
            ajax(data).then(response => {
                if (response.status == "ok") {
                    const newNode = nodeFromAjax(response);
                    addNotification({ "head": "Vytvoření", "body": "Ok: " + newNode.uuid }, false, null, "info");
                    processVNodes([newNode]);
                    addDesktopIcon(newNode);
                } else {
                    addNotification({ "head": "Vytvoření", "body": "Chyba: " + response.details }, false, null, "warning");
                }
            });
        });
    }

    static fileModify = (event) => {
        const uuid = bubbleToClass(event, "icon").querySelector("[data-uuid]").dataset.uuid;
        cl("|📘 Modifying vNode with uuid: ", uuid);
        ajax({ "method": "modify", "fileUuid": uuid }).then(response => {
            if (response.status == "ok") {
                addNotification({ "head": "Upravení", "body": "Ok: " + response.uuid }, false, null, "info");
            } else {
                addNotification({ "head": "Upravení", "body": "Chyba: " + response.details }, false, null, "warning");
            }
        });
    }

    static fileDelete = (event) => {
        const uuid = bubbleToClass(event, "icon").querySelector("[data-uuid]").dataset.uuid;
        cl("|📘 Deleting vNode with uuid: ", uuid);
        ajax({ "method": "delete", "fileUuid": uuid }).then(response => {
            if (response.status == "ok") {
                addNotification({ "head": "Odstanění", "body": "Ok: " + response.uuid }, false, null, "info");

                if (window.location.pathname.split("/").pop().includes("desktop")) {
                    desktop.querySelector('.icon:has([data-uuid="' + uuid + '"])').remove();
                } else {
                    files.querySelector('.file[data-uuid="' + 1 + '"]').remove();
                }
                const app = windows.querySelector('.windows-app[data-uuid="' + uuid + '"]');
                if (app) {
                    closeApp(app, true)
                }
            } else {
                addNotification({ "head": "Odstanění", "body": "Chyba: " + response.details }, false, null, "warning");
            }
        });
    }

    static NoPropagation(event) {
        event.stopPropagation();
    }
}
async function fileRead(uuid) {
    cl("|📘 Reading vNode with uuid: ", uuid);
    const response = await ajax({ "method": "read", "fileUuid": uuid });
    if (response.status == "ok") {
        addNotification({ "head": "Čtení", "body": "Ok: " + response.uuid }, false, null, "info");
        return true;
    } else {
        addNotification({ "head": "Čtení", "body": "Chyba: " + response.details }, false, null, "warning");
        return false;
    }
}

window.addEventListener("blur", () => {
    if (myConfObj.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        closeScreenMenu();
        deselectDesktopIcons();
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
        navbar.querySelector('[data-uuid="' + app.dataset.uuid + '"]').classList.add("active");
        app.style.zIndex = getLowestMaxAppZIndex();
    }
});

window.addEventListener("mousedown", deselectBasedOnClick);
window.addEventListener("touchstart", deselectBasedOnClick);

function deselectBasedOnClick(event) {
    if (!(bubbleToClass(event, "navbar-menu") || bubbleToClass(event, "main-menu"))) {
        closeMainMenu();
    }
    if (!(bubbleToClass(event, "search-menu") || bubbleToClass(event, "searchbar"))) {
        closeSearchbarMenu();
    }
    if (!(bubbleToClass(event, "calendar-container") || bubbleToClass(event, "datetime"))) {
        closeDesktopCalendar();
    }
    if (!(bubbleToClass(event, "navbar-screen") || bubbleToClass(event, "screen-menu"))) {
        closeScreenMenu();
    }
    // bubbleToClass(event, "windows-app")?.classList?.remove("active");
    deselectDesktopIcons();
    if (!bubbleToClass(event, "windows-app") && !bubbleToClass(event, "navbar-icon")) {
        deselectAllApps();
    }
    if (!bubbleToClass(event, "context-menu")) {
        closeAllDesktopContextMenus();
    }
    uploadElement.classList.remove("upload");
}

navbar.querySelector(".navbar-menu").addEventListener("click", (event) => {
    if (bubbleToClass(event, "main-menu") != navbar.querySelector(".navbar-menu > .main-menu")) {
        navbar.querySelector(".navbar-menu > .main-menu").classList.toggle("open");
    }
});


let searchEnterHandler = null;
navbar.querySelector(".navbar-search .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-search > .search-menu").classList.toggle("open");
    if (navbar.querySelector(".navbar-search > .search-menu").classList.contains("open")) {
        navbar.querySelector(".navbar-search input[type=search]").focus();
    }
});

navbar.querySelector(".navbar-screen .navbar-button-content").addEventListener("click", (event) => {
    navbar.querySelector(".navbar-screen .screen-menu").classList.toggle("open");
});

navbar.querySelector(".navbar-notifications .navbar-button-content").addEventListener("click", () => {
    if (navbar.querySelector(".navbar-notifications #notifications").classList.contains("fill") && !navbar.querySelector(".navbar-time > .notifications-container").classList.contains("open")) {
        navbar.querySelector(".navbar-notifications #notifications").classList.remove("fill");
    }
});

navbar.querySelector(".navbar-notifications .notifications-container .clear-all-notifications").addEventListener("click", () => {
    navbar.querySelectorAll(".navbar-notifications .notifications-content > div.notification").forEach((element) => {
        element.classList.add("closing");
        setTimeout(() => {
            element.remove();
        }, 200);
    });
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
        updateCalendar();
    });
});

const appIframeLoaded = () => {
    cl("loaded iframe");
    navbarHolder.classList.add("running");
    navbarHolder.classList.add("active");
};

const timeoutCheck = (periodInS) => {
    setInterval(() => {
        ajax({ "method": "timeoutCheck" }).then(response => {
            if (response.status != "ok") {
                if (!shutdown) {
                    timeoutNotification();
                }
            }
        })
    }, periodInS * 1000);
}

window.onmessage = async function (event) {
    // console.log(event);
    if (event.origin != location.origin) {
        cl("!📕 Origins do not match!!!")
        return;
    }
    console.log("receivedFromIframe: ", event.data);
    switch (event.data[0]) {
        case "appOpen":
            const node = await localDatabase.getColumn("vNodes", "uuid", event.data[1]);
            appOpen(node[0]);
            break;
        case "sessionTimeout":
            if (!shutdown) {
                timeoutNotification();
            }
            shutdown = true;
            break;
        default:
            cl("!📕 Neznámá zpráva z okna!")
    }
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
uploadElement.addEventListener("dragleave", (event) => {
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

function desktopIconOpener(element) {
    element.addEventListener("dblclick", (event) => {
        closeAllDesktopContextMenus();
        // cl("Open Window from Desktop\n", holder);
        let dbStore = localDatabase.getStore("vNodes");

        let idRequest = dbStore.get(element.childNodes[1].dataset.uuid);
        // cl("holder.childNodes[1].dataset.id: ", holder.childNodes[1].dataset.uuid);
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
    function enterToSave(event) {
        event.stopImmediatePropagation();
        if (event.key == "Enter") {
            event.preventDefault();
            stopEdit(event);
        }
    }

    function stopEdit(event) {
        event.target.readOnly = true;
        textDeSelect();
        try {
            event.target.removeEventListener("keydown", enterToSave);
        } catch (e) {
            cl("error: ", e);
        }
    }

    element.addEventListener("dblclick", (event) => {
        closeAllDesktopContextMenus();
        let element = event.toElement;
        element.addEventListener("keydown", enterToSave);
        if (element.readOnly) {
            textSelect(element, 0, element.value.lastIndexOf("."))
            element.readOnly = !element.readOnly
        }
        event.stopPropagation();
    });
    element.addEventListener("focusout", (event) => {
        // cl("srcElement deprecated; Event: ", event)
        // event.target.readOnly = true;
        // textDeSelect()
        stopEdit(event);
    });
}

function deselectDesktopIcons() {
    // cl("deselecting desktop icons");
    document.querySelectorAll("figure.icon.icon-selected").forEach((el) => {
        el.classList.remove("icon-selected");
    });
    // navbar.querySelector(".navbar-time").children[0].classList.remove("open");
    // navbar.querySelector(".navbar-search").children[0].classList.remove("open");
}

desktop.addEventListener("contextmenu", (event) => {
    const container = createElement("div", new ClassList("context-menu", "open", "no-select"), new ElementEvent("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
    }), new ElementEvent("click", (event) => {
        container.remove();
    }));

    let timeout;
    let newPopup;
    const createNew = createElement("span", new ClassList("extra", "material-symbols-rounded-after"), new TextContent("Nový"), new AppendTo(container), new ElementEvent("mouseenter", (event) => {
        timeout = setTimeout(() => {
            if (!newPopup && createNew.matches(':hover')) {
                newPopup = createElement("div", new ClassList("context-menu", "open", "no-select"), new AppendTo(createNew));
                const newFolder = createElement("span", new TextContent("Složka"), new AppendTo(newPopup), new ElementEvent("click", ElementEvents.folderCreate));
                const newHr = createElement("hr", new AppendTo(newPopup));
                const newText = createElement("span", new TextContent("Textoný dokument"), new AppendTo(newPopup), new ElementEvent("click", ElementEvents.fileCreate));

                newPopup.style.left = createNew.getBoundingClientRect().width + 1 + "px";
                if (newPopup.getBoundingClientRect().right > desktop.getBoundingClientRect().right) {
                    newPopup.style.left = "unset";
                    newPopup.style.right = createNew.getBoundingClientRect().width + 1 + "px";

                }
                newPopup.style.bottom = "-2px";
            }
        }, 450);
    }), new ElementEvent("mouseleave", (event) => {
        if (newPopup) {
            createNew.querySelectorAll(".context-menu").forEach(element => {
                element.remove();
            });
            newPopup = null;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = null;
        }
    }));


    const properties = createElement("span", new TextContent("Vlastnosti"), new AppendTo(container));

    positionContextMenu(container, desktop);
});

function desktopIconContextMenu(element, node) {
    element.addEventListener("contextmenu", function (event) {
        event.stopPropagation();
        // cl("Open ContextMenu from Desktop\n", element, node);

        deselectDesktopIcons();
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
        closeScreenMenu();
        deselectAllApps();
        closeAllDesktopContextMenus();

        const container = createElement("div", new ClassList("context-menu", "open", "no-select"), new ElementEvent("contextmenu", (event) => {
            event.preventDefault();
            event.stopPropagation();
        }));

        const open = createElement("span", new TextContent("Otevřít"), new AppendTo(container), new ElementEvent("click", () => { appOpen(node) }));

        if (node.type == "file" && node.name.split(".").pop() == "txt") {
            const edit = createElement("span", new TextContent("Upravit"), new AppendTo(container));
        }

        if (node.type == "file") {
            const print = createElement("span", new TextContent("Tisknout"), new AppendTo(container), new ElementEvent("click", () => {
                const iframe = createElement("iframe", new ClassList("hidden"), new Src(getDestination(node)), new AppendTo(document.body), new ElementEvent("afterprint", () => self.close));
                cl("Printing: ", iframe);
                iframe.contentWindow.print();
                setTimeout(() => {
                    iframe.remove();
                }, 300000);
            }));
        }

        const hr1 = createElement("hr", new AppendTo(container));

        const copy = createElement("span", new TextContent("Kopírovat"), new AppendTo(container));

        if (node.type != "link") {
            const download = createElement("span", new TextContent("Stáhnout"), new AppendTo(container));
        }

        const hr2 = createElement("hr", new AppendTo(container));

        if (node.permissions.canDelete) {
            const remove = createElement("span", new TextContent("Odstranit"), new AppendTo(container), new ElementEvent("click", ElementEvents.fileDelete));
        }
        const rename = createElement("span", new TextContent("Přejmenovat"), new AppendTo(container));

        const hr3 = createElement("hr", new AppendTo(container));

        const properties = createElement("span", new TextContent("Vlastnosti"), new AppendTo(container));

        positionContextMenu(container, element);
    });
}

document.addEventListener("keydown", async (event) => {
    if (event.ctrlKey && (event.key == "a" || event.key == "A") && event.target != navbar.querySelector(".navbar-search input[type=search]")) {
        deselectDesktopIcons();
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        closeScreenMenu();
        deselectAllApps();
        closeAllDesktopContextMenus();
        desktop.querySelectorAll(".icon").forEach((element) => {
            element.classList.add("icon-selected");
        });
        return;
    }
    switch (event.key) {
        case "Escape":
            closeAllDesktopContextMenus();
            deselectDesktopIcons();
            break;
        case "Enter":
            desktop.querySelectorAll(".icon-selected > figcaption").forEach(async (element) => {
                const node = await localDatabase.getColumn("vNodes", "uuid", element.dataset.uuid);
                appOpen(node[0]);
            });
            break;
        case "ArrowUp":
        case "ArrowLeft":
            const up = document.querySelector(".icon:has(+ .icon-selected)");
            if (up) {
                if (!event.shiftKey) {
                    deselectDesktopIcons();
                }
                up.classList.add("icon-selected");
            }
            break;
        case "ArrowDown":
        case "ArrowRight":
            // const down = desktop.querySelector(".icon-selected + *")
            const down = desktop.querySelector(".icon-selected:not(:has(~ .icon-selected)) + *");
            if (down) {
                if (!event.shiftKey) {
                    deselectDesktopIcons();
                }
                down.classList.add("icon-selected");
            }
            break;
        default:
            return;
    }
});

function desktopIconSelect(element) {
    element.addEventListener("click", (event) => {
        if (!is_key_down("Control")) {
            deselectDesktopIcons();
        }
        element.classList.toggle("icon-selected");
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        closeScreenMenu();
        closeAllDesktopContextMenus();
        event.stopPropagation();
    })
}

window.addEventListener("DOMContentLoaded", () => {
    let brightness = navbar.querySelector(".screen-menu > .slider-brightness > input")
    function brightnessChange() {
        const percentage = updateSlider(brightness);
        cssVar("--brightness", (95 - percentage) + "%");
    }
    brightness.oninput = brightnessChange;
    brightnessChange(brightness);

    let blueLightFilter = navbar.querySelector(".screen-menu > .slider-blue-light-filter > input")
    function blueLightFilterChange() {
        const percentage = updateSlider(blueLightFilter);
        cssVar("--blue-filter", percentage + "%");
    }
    blueLightFilter.oninput = blueLightFilterChange;
    blueLightFilterChange(blueLightFilter);
});

function mouseSelectBox() {
    let selecting;
    let startX, startY;
    let selectBox;
    let desktopSize;
    let desktopIcons;

    function selectStart(target, position) {
        if (target == desktop) {
            startX = position[0];
            startY = position[1];
            selectBox = createElement("div", new ClassList("select-box"), new AppendTo(desktop));
            selecting = true;
            deselectDesktopIcons();
            desktopSize = desktop.getBoundingClientRect();
            desktopIcons = desktop.querySelectorAll(".icon");
        }
    }

    function selectMove(position) {
        if (selecting) {
            let mouseX = position[0];
            let mouseY = position[1];

            if (mouseX > desktopSize.width - 2) {
                mouseX = desktopSize.width - 2;
            }
            if (mouseX < 0) {
                mouseX = 0;
            }
            if (mouseY > desktopSize.height) {
                mouseY = desktopSize.height;
            }
            if (mouseY < 0) {
                mouseY = 0;
            }

            if (mouseX < startX) {
                selectBox.style.left = mouseX + "px";
                selectBox.style.width = (startX - mouseX) + "px";
            } else {
                selectBox.style.left = startX + "px";
                selectBox.style.width = (mouseX - startX) + "px";
            }
            if (mouseY < startY) {
                selectBox.style.top = mouseY + "px";
                selectBox.style.height = (startY - mouseY) + "px";
            } else {
                selectBox.style.top = startY + "px";
                selectBox.style.height = (mouseY - startY) + "px";
            }

            desktopIcons.forEach((element) => {
                if (elementsCollide(element, selectBox)) {
                    element.classList.add("icon-selected");
                } else {
                    element.classList.remove("icon-selected");
                }
            });
        }
    }

    function deSelect() {
        if (selecting) {
            selectBox.remove();
        }
        selecting = false;
    }

    window.addEventListener("mousedown", (event) => selectStart(event.target, [event.clientX, event.clientY]));
    window.addEventListener("touchstart", (event) => selectStart(event.target, [event.touches[0].clientX, event.touches[0].clientY]));

    window.addEventListener("mousemove", (event) => selectMove([event.clientX, event.clientY]));
    window.addEventListener("touchmove", (event) => selectMove([event.touches[0].clientX, event.touches[0].clientY]));

    window.addEventListener("mouseup", deSelect);
    window.addEventListener("touchend", deSelect);
    window.addEventListener("blur", deSelect);
}

// window.ontouchstart = function (event) {
//     if (event.touches.length > 1) { //If there is more than one touch
//         event.preventDefault();
//     }
// }

powerButton.addEventListener("click", async () => {
    const exitVideo = createElement("video", new Id("logoutAnimation"));
    const source = createElement("source", new Src("media/login/bloomReverse.mp4"), new Type("video/mp4"), new AppendTo(exitVideo));
    document.body.appendChild(exitVideo);
    exitVideo.play();
    await sleep(2500);
    location.replace(location.origin + "/~bukovja4/public/auth.php?method=logout");
});

navbar.querySelector(".main-menu .controls > .user").addEventListener("click", () => {
    addNotification({ "head": "Hlavní menu", "body": "Kliknul jsi na ikonku uživatele" });
});