"use strict";

const DEBUG = true;

window.addEventListener("DOMContentLoaded", async () => {
    cl("|-Document Ready");
    let time1 = new Date();

    cl("|>Clearing database")
    await deleteDb();

    cl("|>Opening indexedDB")
    openDb();

    while (!localDatabase) {
        await sleep(4);
    }

    cl("|>Processing userIdentifier...");
    await processUserIdentifier();

    cl("|>Processing vNodes...");
    await processVNodes();

    cl("|>Processing desktop...");
    await processDesktopIcons();

    cl("|-Finished in " + (new Date() - time1) + "ms");
    return;
});

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("user", Object.keys(new user()), "uuid")];
// const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("vFiles", Object.keys(new vFile()), "uuid")];

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

async function processUserIdentifier() {
    let time1 = new Date();
    await localDatabase.add("user", userIdentifier);
    cl("|<userIdentifier processed in " + (new Date() - time1) + "ms");
}

async function processVNodes() {
    let time1 = new Date();
    vNodes.forEach(async (node) => {
        await localDatabase.add("vNodes", node);
    })
    cl("|<vNodes processed in " + (new Date() - time1) + "ms");
}

async function processDesktopIcons() {
    let time1 = new Date();
    let rootId = await localDatabase.getColumn("vNodes", "type", "root");

    //TODO: fetch vNodes from data[] of rootId

    let desktopNode = await localDatabase.getColumn("vNodes", "parent", rootId[0].id).then((result) => result.find((node) => node.type === "desktop"));
    // cl("desktopNode: ", desktopNode);

    //TODO: fetch vNodes from data[] of desktopNode

    let desktopNodes = await localDatabase.getColumn("vNodes", "parent", desktopNode.id);

    // cl("desktopNodes: ", desktopNodes);

    desktopNodes.forEach((node) => addDesktopIcon(node));

    cl("|<Desktop processed in " + (new Date() - time1) + "ms");
}

function openWindow(data) {
    cl("opening window", data);
}

function addDesktopIcon(node) {
    // cl(" - adding desktop icon", node);
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
        let dbStore = localDatabase.getStore("vNodes");

        let idRequest = dbStore.get(holder.childNodes[1].dataset.id);
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

            openWindow(data);
        }
        event.preventDefault();
    });
    holder.addEventListener('contextmenu', function (event) {
        cl("Open ContextMenu from Desktop\n", holder);
        event.preventDefault();
    });

    let icon = document.createElement("img");
    if (node.icon) {
        icon.src = node.icon;
    } else {
        switch (node.type) {
            case "trash":
                icon.src = "./media/file-icons/trash.webp";
                break;
            case "link":
                if (node.data[0]) {
                    switch (node.data[0].split(":\/\/").shift()) {
                        case "vLinkTrash":
                            icon.src = "./media/file-icons/trash.webp";
                            break;
                        default:
                            icon.src = "./media/file-icons/unknown.webp"
                    }
                } else {
                    icon.src = "./media/file-icons/link.webp";
                }
                break;
            case "folder":
            case "images":
            case "documents":
                icon.src = "./media/file-icons/folder.webp";
                break;
            case "pdf":
                icon.src = "./media/file-icons/pdf.webp";
                break;
            case "file":
                if (node.name) {
                    switch (node.name.split(".").pop()) {
                        case "txt":
                            icon.src = "./media/file-icons/text-document.webp";
                            break;
                        case "pdf":
                            icon.src = "./media/file-icons/pdf.webp";
                            break;
                        default:
                            icon.src = "./media/file-icons/unknown.webp"
                    }
                } else {
                    icon.src = "./media/file-icons/unknown.webp"
                }
                break;
            default:
                icon.src = "./media/file-icons/unknown.webp";
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
    caption.dataset.id = node.id;
    holder.appendChild(caption);

    let textarea = document.createElement("textarea");
    textarea.name = "icon-name";
    textarea.cols = 11;
    textarea.readOnly = true;
    textarea.textContent = node.name;
    caption.appendChild(textarea);

    desktop.appendChild(holder);
}