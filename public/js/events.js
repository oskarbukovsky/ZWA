"use strict";

/**
 * Class containing static methods related to element events.
 */
class ElementEvents {
    /**
     * Sets the `iframeMouseOver` property to true and updates the `lastIframe` property
     * with the target of the mouseover event.
     * @param {Event} event - The mouseover event object.
     * @returns None
     */
    static appIframeMouseOver = (event) => {
        iframesHelper.iframeMouseOver = true;
        iframesHelper.lastIframe = event.target;
        // if (document.querySelector(".uploading").classList.containg("upload")) {
        //     document.querySelector(".uploading").classList.remove("upload");
        // }
        // cl(event.target)
    };

    /**
     * Sets the iframeMouseOver property to false and clears the lastIframe reference.
     * @returns None
     */
    static appIframeMouseOut = () => {
        iframesHelper.iframeMouseOver = false;
        iframesHelper.lastIframe = null;
    };

    /**
     * Handles the click event on a navbar icon by toggling the active state of the icon
     * and showing/hiding the corresponding app window.
     * @param {Event} event - The click event object.
     * @returns None
     */
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

    /**
     * Creates a new file vNode by sending a request to the server and processing the response.
     * @param {Event} event - The event that triggered the file creation.
     * @returns None
     */
    static fileCreate = (event) => {
        cl("|📘 Creating new file vNode");
        localDatabase.getColumn("vNodes", "type", "desktop").then(desktopNode => {
            const data = { "method": "create", "type": "file", "parent": desktopNode[0].uuid };
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

    /**
     * Creates a new folder vNode in the desktop.
     * @param {Event} event - The event that triggered the folder creation.
     * @returns None
     */
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

    /**
     * Modifies a vNode file based on the event triggered.
     * @param {Event} event - The event that triggered the file modification.
     * @returns None
     */
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

    /**
     * Deletes a file based on the event triggered.
     * @param {Event} event - The event that triggered the file deletion.
     * @returns None
     */
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

/**
 * Asynchronously reads a vNode file with the given UUID.
 * @param {string} uuid - The UUID of the vNode file to read.
 * @returns {boolean} - Returns true if the file was read successfully, false otherwise.
 */
async function fileRead(uuid) {
    cl("|📘 Reading vNode with uuid: ", uuid);
    const response = await ajax({ "method": "read", "fileUuid": uuid });
    if (response.status == "ok") {
        addNotification({ "head": "Čtení", "body": "Ok: " + response.uuid }, false, null, "info");
        return true;
    } else {
        addNotification({ "head": "Čtení", "body": "Chyba: " + response.details }, false, null, "warning");
        if (response.details == "sessionTimeout") {
            window.postMessage(["sessionTimeout"]);
        }
        return false;
    }
}

/**
 * Adds an event listener to the window that listens for a mouseout event.
 * When the mouseout event is triggered, it removes the "upload" class from the uploadElement.
 * @returns None
 */
window.addEventListener("mouseout", () => {
    uploadElement.classList.remove("upload");
});

/**
 * Event listener that triggers when the window loses focus. It performs a series of actions
 * to handle the blur event, including removing a CSS class from an upload element, closing
 * various menus and calendars, deselecting icons, and setting the active state for a specific app.
 * @returns None
 */
window.addEventListener("blur", () => {
    uploadElement.classList.remove("upload");
    if (iframesHelper.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        closeScreenMenu();
        deselectDesktopIcons();
        deselectAllApps();
        closeAllDesktopContextMenus();
        let app = iframesHelper.lastIframe;
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

/**
 * Handles the click event based on the element clicked.
 * Closes various menus based on the clicked element.
 * @param {Event} event - The click event object.
 * @returns None
 */
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

/**
 * Adds a click event listener to the navbar menu that toggles the "open" class on the main menu.
 * @param {Event} event - The click event object.
 * @returns None
 */
navbar.querySelector(".navbar-menu").addEventListener("click", (event) => {
    if (bubbleToClass(event, "main-menu") != navbar.querySelector(".navbar-menu > .main-menu")) {
        navbar.querySelector(".navbar-menu > .main-menu").classList.toggle("open");
    }
});


/**
 * Event listener for handling the search functionality in the navbar.
 * Toggles the visibility of the search menu and focuses on the search input field when opened.
 * @param None
 * @returns None
 */
let searchEnterHandler = null;
navbar.querySelector(".navbar-search .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-search > .search-menu").classList.toggle("open");
    if (navbar.querySelector(".navbar-search > .search-menu").classList.contains("open")) {
        navbar.querySelector(".navbar-search input[type=search]").focus();
    }
});

/**
 * Adds a click event listener to a navbar button that toggles the "open" class
 * on the screen menu element.
 * @param {Event} event - The event object triggered by the click.
 * @returns None
 */
navbar.querySelector(".navbar-screen .navbar-button-content").addEventListener("click", (event) => {
    navbar.querySelector(".navbar-screen .screen-menu").classList.toggle("open");
});

/**
 * Adds a click event listener to the navbar notifications button to toggle the visibility of notifications.
 * If the notifications are filled and the notifications container is not open, it removes the fill class.
 * @param None
 * @returns None
 */
navbar.querySelector(".navbar-notifications .navbar-button-content").addEventListener("click", () => {
    if (navbar.querySelector(".navbar-notifications #notifications").classList.contains("fill") && !navbar.querySelector(".navbar-time > .notifications-container").classList.contains("open")) {
        navbar.querySelector(".navbar-notifications #notifications").classList.remove("fill");
    }
});

/**
 * Adds a click event listener to the "Clear All Notifications" button in the navbar.
 * Removes all notification elements with a closing animation.
 * @param None
 * @returns None
 */
navbar.querySelector(".navbar-notifications .notifications-container .clear-all-notifications").addEventListener("click", () => {
    navbar.querySelectorAll(".navbar-notifications .notifications-content > div.notification").forEach((element) => {
        element.classList.add("closing");
        setTimeout(() => {
            element.remove();
        }, 200);
    });
});

/**
 * Adds a click event listener to a specific element within the navbar to toggle the visibility
 * of the calendar container.
 * @param {string} selector - The CSS selector for the element to add the event listener to.
 * @returns None
 */
navbar.querySelector(".navbar-time .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-time > .calendar-container").classList.toggle("open");
});

/**
 * Adds a click event listener to the navbar minimize button that minimizes all windows apps.
 * Deselects all apps and adds the 'minimized' class to each app element.
 * @param None
 * @returns None
 */
navbar.querySelector(".navbar-minimize").addEventListener("click", () => {
    // cl(".navbar-minimize");
    deselectAllApps();
    windows.querySelectorAll(".windows-app").forEach((app) => {
        app.classList.add("minimized");
    });
});

/**
 * Adds event listeners to the navigation icons in the calendar.
 * Updates the month and year based on the icon clicked and calls updateCalendar function.
 * @param None
 * @returns None
 */
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

/**
 * Function to handle the event when the app iframe has finished loading.
 * It adds classes to the navbarHolder element to indicate that the iframe is running and active.
 * @returns None
 */
const appIframeLoaded = () => {
    cl("loaded iframe");
    navbarHolder.classList.add("running");
    navbarHolder.classList.add("active");
};

/**
 * Sets up a periodic check to monitor for timeouts.
 * @param {number} periodInS - The period in seconds at which to check for timeouts.
 * @returns None
 */
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

/**
 * Sets up a message event listener on the window object to handle messages received from iframes.
 * @param {Event} event - The event object containing information about the message.
 * @returns None
 */
window.onmessage = async function (event) {
    // console.log(event);
    if (event.origin != location.origin) {
        cl("!📕 Origins do not match!!!")
        return;
    }
    cl("|📘 ReceivedFromIframe: ", event.data);
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
        case "fileUploading":
            handleFileUpload(event.data[1]);
            break;
        default:
            cl("!📕 Neznámá zpráva z okna!")
    }
};

/**
 * Adds an event listener for the "resize" event that triggers the windowResize method
 * of the appResizing object.
 * @param {string} "resize" - The event type to listen for.
 * @param {function} () => { appResizing.windowResize(); } - The callback function to execute when the event is triggered.
 * @returns None
 */
window.addEventListener("resize", () => {
    appResizing.windowResize();
});

/**
 * Sets the appResizing status to true and assigns the current object as the second element in the status array.
 * @returns None
 */
function appResizeDown() {
    appResizing.status = [true, this];
}
/**
 * Set the appResizing status to false, indicating that the app is not resizing up.
 * @returns None
 */
function appResizeUp() {
    appResizing.status = [false];
}

/**
 * Event listener for the "dragover" event that prevents the default behavior.
 * @param {Event} event - The event object for the "dragover" event.
 * @returns None
 */
desktop.addEventListener("dragover", (event) => {
    event.preventDefault();
});

/**
 * Event listener for the "dragenter" event that prevents the default behavior
 * and adds the "upload" class to the upload element.
 * @param {Event} event - The event object for the dragenter event.
 * @returns None
 */
desktop.addEventListener("dragenter", (event) => {
    event.preventDefault();
    uploadElement.classList.add("upload");
});
/**
 * Adds an event listener to handle the "dragleave" event on the upload element.
 * Prevents the default behavior of the event and removes the "upload" class from the upload element.
 * @param {Event} event - The dragleave event object.
 * @returns None
 */
uploadElement.addEventListener("dragleave", (event) => {
    event.preventDefault();
    uploadElement.classList.remove("upload");
});

/**
 * Adds an event listener for the "drop" event to handle file uploads.
 * Removes the "upload" class from the upload element, prevents the default behavior of the event,
 * retrieves the files from the data transfer, assigns the files to the fileUpload element, and
 * calls the handleFileUpload function with the files.
 * @param {string} event - The event to listen for ("drop").
 * @param {function} callback - The function to execute when the event occurs.
 * @returns None
 */
desktop.addEventListener("drop", (event) => {
    uploadElement.classList.remove("upload");
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
        fileUpload.files = files;
        handleFileUpload(files)
    }
});

/**
 * Adds a double click event listener to the given element to open a context menu.
 * Retrieves data from local database based on the element's UUID and updates the timestamp.
 * @param {Element} element - The element to attach the event listener to.
 * @returns None
 */
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

/**
 * Allows the user to edit the name of a desktop icon by double-clicking on it.
 * @param {Element} element - The desktop icon element to edit the name of.
 * @returns None
 */
function desktopIconEditName(element) {
    /**
     * Function to handle the 'Enter' key press event to save the changes.
     * @param {Event} event - The event object triggered by the key press.
     * @returns None
     */
    function enterToSave(event) {
        event.stopImmediatePropagation();
        if (event.key == "Enter") {
            event.preventDefault();
            stopEdit(event);
        }
    }

    /**
     * Disables editing on the target element, deselects any text, and removes the event listener for saving on keydown.
     * @param {Event} event - The event object triggered by the action.
     * @returns None
     */
    function stopEdit(event) {
        event.target.readOnly = true;
        textDeSelect();
        try {
            event.target.removeEventListener("keydown", enterToSave);
        } catch (e) {
            cl("error: ", e);
        }
    }

    /**
     * Event listener for double click event on an element. 
     * Closes all desktop context menus, adds event listener for keydown event to save changes,
     * selects text within the element, toggles the readOnly property of the element, and stops event propagation.
     * @param {Event} event - The double click event object.
     * @returns None
     */
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
    /**
     * Event listener for the "focusout" event that calls the stopEdit function.
     * @param {Event} event - The event object triggered by the "usout" event.
     * @returns None
     */
    element.addEventListener("focusout", (event) => {
        // cl("srcElement deprecated; Event: ", event)
        // event.target.readOnly = true;
        // textDeSelect()
        stopEdit(event);
    });
}

/**
 * Deselects all desktop icons by removing the "icon-selected" class from each selected icon.
 * @returns None
 */
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
                const newText = createElement("span", new TextContent("Textový dokument"), new AppendTo(newPopup), new ElementEvent("click", ElementEvents.fileCreate));

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
    }), new ElementEvent("click", (event) => {
        // event.stopImmediatePropagation();
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

const fileSearchInputHandler = debounce((query) => {
    cl("|📘 Searching for vNode: ", query);
    localDatabase.getColumn("vNodes", "type", "desktop").then(desktopNode => {
        const data = { "method": "search", "query": query };
        cl("|📗 Sending data:", data);
        ajax(data).then(response => {
            if (response.status == "ok") {
                addNotification({ "head": "Hledání", "body": "Ok: \"" + query + "\"" }, false, null, "info");
            } else {
                addNotification({ "head": "Hledání", "body": "Chyba: " + response.details }, false, null, "warning");
            }
        });
    });
}, 350);

navbar.querySelector(".navbar-search .search-bar>input[type=search]").addEventListener("input", async (event) => {
    const query = event.target.value;
    fileSearchInputHandler(query)
});

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