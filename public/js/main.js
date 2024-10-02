"use strict";

window.addEventListener("load", async () => {
    cl("| Document Ready");
    // localDatabase.close();
    openDb();
    cl("| indexedDB Ready");
    await processData();
    cl("| Data Processed");
    return;
});

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("desktopIcons", Object.keys(new desktopIcon())), new dbShape("navbarIcons", Object.keys(new navbarIcon())), new dbShape("directoryHandlers", Object.keys(new directoryHandler())), new dbShape("fileHandlers", Object.keys(new fileHandler())), new dbShape("vNodes", Object.keys(new vNode()))];

window.addEventListener("click", () => {
    deselectIcons();
})

desktop.querySelectorAll("#desktop > .icon > figcaption").forEach((el) => {
    el.addEventListener("dblclick", (event) => {
        let element = event.toElement;
        if (element.readOnly) {
            textSelect(element, 0, element.value.lastIndexOf('.'))
            element.readOnly = !element.readOnly
        }
        event.stopPropagation();
    });
    el.addEventListener("focusout", (event) => {
        event.srcElement.readOnly = true;
        textDeSelect()
    });
});

document.querySelectorAll("#desktop > .icon").forEach((iconElement) => {
    iconElement.addEventListener("click", (event) => {
        if (!is_key_down('Control')) {
            deselectIcons();
        }
        iconElement.classList.add("icon-selected");
        event.stopPropagation();
    })
    iconElement.addEventListener("dblclick", (event) => {
        cl("Open Window from Desktop\n", iconElement);
    });
    iconElement.addEventListener('contextmenu', function (event) {
        cl("Open ContextMenu from Desktop\n", iconElement);
        event.preventDefault();
    });
});

async function processData() {
    while (!localDatabase) {
        await sleep(20);
    }
    cl("| Processing data...");
    processDesktopIcons();
    cl("| Desktop Icons processed")
    cl("| Processing vNodes...");
    processVNodes();
    cl("| vNodes processed")
    return;
}

function processVNodes() {
    vNodes.forEach(function (node) {
        pushNodeToLocalDb(node);
    })
}

function pushNodeToLocalDb(node) {
    cl(" - Processing:", node);
    localDatabase.getStore("vNodes", "readwrite").add(node)
}

function processDesktopIcons() {
    if (desktopIcons) {
        desktopIcons.forEach(function (item) {
            addDesktopIcon(item);
        });
    }
    return;
}

function openWindow(data) {
    cl("opening window", data);
}

function addDesktopIcon(item) {
    let holder = document.createElement("figure");
    holder.classList.add("icon");
    holder.addEventListener("click", (event) => {
        if (!is_key_down('Control')) {
            deselectIcons();
        }
        holder.classList.add("icon-selected");
        event.stopPropagation();
    })
    holder.addEventListener("dblclick", (event) => {
        // cl("Open Window from Desktop\n", holder);
        let dbStore = localDatabase.getStore("desktopIcons");

        let idRequest = dbStore.get(Number(holder.childNodes[1].dataset.id));
        idRequest.onsuccess = function () {
            let data = idRequest.result;
            cl("get success: ", data);
            data.timeRead = Date.now();

            let putRequest = dbStore.put(data);
            putRequest.onsuccess = function () {
                cl("put success: ", putRequest);
            }

            //TODO Sync with server

            openWindow(data);
        }
        event.preventDefault();
    });
    holder.addEventListener('contextmenu', function (event) {
        cl("Open ContextMenu from Desktop\n", holder);
        event.preventDefault();
    });

    let icon = document.createElement("img");
    if (item.icon) {
        icon.src = item.icon;
    } else {
        switch (item.type) {
            case "trash":
                icon.src = "../imgs/defaults/trash.png";
                break;
            case "link":
                icon.src = "../imgs/defaults/link.png";
                break;
            case "pdf":
                icon.src = "../imgs/defaults/pdf.png";
                break;
            case "folder":
                icon.src = "../imgs/defaults/folder.png";
                break;
            case "text":
                icon.src = "../imgs/defaults/text-document.png";
                break;
            default:
                icon.src = "../imgs/defaults/invalid.png";
        }
    }
    holder.appendChild(icon);

    let caption = document.createElement("figcaption");
    caption.addEventListener("dblclick", (event) => {
        let element = event.toElement;
        if (element.readOnly) {
            textSelect(element, 0, element.value.lastIndexOf('.'))
            element.readOnly = !element.readOnly
        }
        event.stopPropagation();
    });
    caption.addEventListener("focusout", (event) => {
        // cl("srcElement deprecated; Event: ", event)
        event.target.readOnly = true;
        textDeSelect()
    });
    caption.dataset.id = item.id;
    holder.appendChild(caption);

    let textarea = document.createElement("textarea");
    textarea.name = "icon-name";
    textarea.cols = 11;
    textarea.readOnly = true;
    textarea.textContent = item.name;
    caption.appendChild(textarea);

    desktop.appendChild(holder);
    localDatabase.getStore("desktopIcons", "readwrite").add(item)
}