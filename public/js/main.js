"use strict";

window.addEventListener("load", async () => {
    var req = indexedDB.deleteDatabase("ZWA");
    req.onsuccess = function () {
        console.log("| Deleted database successfully");
    };
    req.onerror = function () {
        console.log("| Couldn't delete database");
    };
    req.onblocked = function () {
        console.log("| Couldn't delete database due to the operation being blocked");
    };
    await sleep(1000);

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

    await localDatabase.getColumn("vNodes", "data", [0]);


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

function addDesktopIcon(item) {
    cl(" - adding desktop icon", item);
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