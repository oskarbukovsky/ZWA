"use strict";

window.addEventListener("DOMContentLoaded", async () => {
    let time1 = new Date();
    // var req = indexedDB.deleteDatabase("ZWA");
    // req.onsuccess = function () {
    //     cl("| Deleted database successfully");
    // };
    // req.onerror = function () {
    //     cl("| Couldn't delete database");
    // };
    // req.onblocked = function () {
    //     cl("| Couldn't delete database due to the operation being blocked");
    // };
    await deleteDb();
    // await sleep(1000);

    cl("| Document Ready");
    // localDatabase.close();
    openDb();
    cl("| indexedDB Ready");
    await processData();
    cl("| Data Processed");

    cl("| Finished in " + (new Date() - time1) + "ms");
    return;
});

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id")];
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

async function processData() {
    while (!localDatabase) {
        await sleep(20);
    }
    cl("| Processing vNodes...");
    processVNodes();
    cl("| vNodes processed")
    cl("| Processing desktop...");
    await processDesktopIcons();
    cl("| Desktop processed")
    // cl("| Processing vFiles...");
    // processVFiles();
    // cl("| vFiles processed")
    return;
}

function processVNodes() {
    vNodes.forEach(function (node) {
        pushDataToLocalDb("vNodes", node);
    })
}

function pushDataToLocalDb(store, node) {
    // cl(" - Processing:", node);
    localDatabase.getStore(store, "readwrite").add(node)
}

async function processDesktopIcons() {
    // let dbStore = localDatabase.getStore("vNodes");

    // let idRequest = dbStore.get("Základní složka");
    // idRequest.onsuccess = function () {
    //     let data = idRequest.result;
    //     cl(data);
    // }

    // let time1 = new Date;

    let rootId = await localDatabase.getColumn("vNodes", "type", "root");

    //TODO: fetch vNodes from data[] of rootId

    let desktopNode = await localDatabase.getColumn("vNodes", "parent", rootId[0].id).then((result) => result.find((node) => node.type === "desktop"));

    // cl("desktopNode: ", desktopNode);

    //TODO: fetch vNodes from data[] of desktopNode

    let desktopNodes = await localDatabase.getColumn("vNodes", "parent", desktopNode.id);

    // cl("desktopNodes: ", desktopNodes);

    desktopNodes.forEach((node) => addDesktopIcon(node));

    // console.log("Time: ", (new Date()) - time1 + "ms");

    // let desktopNode = desktopNodePre.find((node) => node.type === "desktop");
    // cl("desktopNode: ", desktopNode);
    // dbStore.openCursor(range).onsuccess = function (e) {
    //     let cursor = e.target.result;
    //     if (cursor) {
    //         console.log(cursor.key, cursor.value);
    //         cursor.continue();
    //     }
    //     else {
    //         cl('---------------------------------');
    //     }
    // };

    // if (desktopIcons) {
    //     desktopIcons.forEach(function (item) {
    //         addDesktopIcon(item);
    //     });
    // }
    return;
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
                icon.src = "./media/defaults/trash.webp";
                break;
            case "link":
                if (node.data[0]) {
                    switch (node.data[0].split(":\/\/").shift()) {
                        case "vLinkTrash":
                            icon.src = "./media/defaults/trash.webp";
                            break;
                        default:
                            icon.src = "./media/defaults/unknown.webp"
                    }
                } else {
                    icon.src = "./media/defaults/link.webp";
                }
                break;
            case "folder":
            case "images":
            case "documents":
                icon.src = "./media/defaults/folder.webp";
                break;
            case "pdf":
                icon.src = "./media/defaults/pdf.webp";
                break;
            case "file":
                if (node.name) {
                    switch (node.name.split(".").pop()) {
                        case "txt":
                            icon.src = "./media/defaults/text-document.webp";
                            break;
                        case "pdf":
                            icon.src = "./media/defaults/pdf.webp";
                            break;
                        default:
                            icon.src = "./media/defaults/unknown.webp"
                    }
                } else {
                    icon.src = "./media/defaults/unknown.webp"
                }
                break;
            default:
                icon.src = "./media/defaults/unknown.webp";
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
    // localDatabase.getStore("desktopIcons", "readwrite").add(node)
}

// function addDesktopIcon(item) {
//     let holder = document.createElement("figure");
//     holder.classList.add("icon");
//     holder.addEventListener("click", (event) => {
//         if (!is_key_down('Control')) {
//             deselectIcons();
//         }
//         holder.classList.add("icon-selected");
//         event.stopPropagation();
//     })
//     holder.addEventListener("dblclick", (event) => {
//         // cl("Open Window from Desktop\n", holder);
//         let dbStore = localDatabase.getStore("desktopIcons");

//         let idRequest = dbStore.get(Number(holder.childNodes[1].dataset.id));
//         idRequest.onsuccess = function () {
//             let data = idRequest.result;
//             cl("get success: ", data);
//             data.timeRead = Date.now();

//             let putRequest = dbStore.put(data);
//             putRequest.onsuccess = function () {
//                 cl("put success: ", putRequest);
//             }

//             //TODO Sync with server

//             openWindow(data);
//         }
//         event.preventDefault();
//     });
//     holder.addEventListener('contextmenu', function (event) {
//         cl("Open ContextMenu from Desktop\n", holder);
//         event.preventDefault();
//     });

//     let icon = document.createElement("img");
//     if (item.icon) {
//         icon.src = item.icon;
//     } else {
//         switch (item.type) {
//             case "trash":
//                 icon.src = "../media/defaults/trash.png";
//                 break;
//             case "link":
//                 icon.src = "../media/defaults/link.png";
//                 break;
//             case "pdf":
//                 icon.src = "../media/defaults/pdf.png";
//                 break;
//             case "folder":
//                 icon.src = "../media/defaults/folder.png";
//                 break;
//             case "text":
//                 icon.src = "../media/defaults/text-document.png";
//                 break;
//             default:
//                 icon.src = "../media/defaults/invalid.png";
//         }
//     }
//     holder.appendChild(icon);

//     let caption = document.createElement("figcaption");
//     caption.addEventListener("dblclick", (event) => {
//         let element = event.toElement;
//         if (element.readOnly) {
//             textSelect(element, 0, element.value.lastIndexOf('.'))
//             element.readOnly = !element.readOnly
//         }
//         event.stopPropagation();
//     });
//     caption.addEventListener("focusout", (event) => {
//         // cl("srcElement deprecated; Event: ", event)
//         event.target.readOnly = true;
//         textDeSelect()
//     });
//     caption.dataset.id = item.id;
//     holder.appendChild(caption);

//     let textarea = document.createElement("textarea");
//     textarea.name = "icon-name";
//     textarea.cols = 11;
//     textarea.readOnly = true;
//     textarea.textContent = item.name;
//     caption.appendChild(textarea);

//     desktop.appendChild(holder);
//     localDatabase.getStore("desktopIcons", "readwrite").add(item)
// }


// function processVFiles() {
//     vFiles.forEach(function (node) {
//         pushDataToLocalDb("vFiles", node);
//     })
// }