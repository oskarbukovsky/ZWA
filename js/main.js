"use strict";

window.addEventListener("load", () => {
    cl("| Document Ready");
    openDb();
    cl("| indexedDB Ready");
    processData();
    cl("| Data Processed");
});

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("desktopIcons", Object.keys(new desktopIcon())), new dbShape("navbarIcons", Object.keys(new navbarIcon())), new dbShape("directoryHandlers", Object.keys(new directoryHandler())), new dbShape("fileHandlers", Object.keys(new fileHandler()))];

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


function openDb() {
    let localDatabaseRequest = indexedDB.open(dbName, 1);

    localDatabaseRequest.onsuccess = function () {
        localDatabase = this.result;
        localDatabase.getStore = function (store, readonly_readwrite) {
            return localDatabase.transaction(store, readonly_readwrite).objectStore(store);
        };
        // localDatabase.stores = new Map();
        // [...localDatabase.objectStoreNames].forEach((el) => {
        //     localDatabase.stores.set(el, localDatabase.transaction(el, "readwrite").objectStore(el));
        // })
    };

    localDatabaseRequest.onerror = function (event) {
        console.error("Prohlížeč nepodporuje nebo je zakázaná IndexedDB\nVýjimečně může být strana v kódu stránky\n", event.target.error?.message);
    };

    localDatabaseRequest.onupgradeneeded = function (event) {
        let dbStore;
        dbStores.forEach((element) => {
            dbStore = event.currentTarget.result.createObjectStore(element.name, { keyPath: "id", autoIncrement: true });
            element.columns.forEach((column) => {
                dbStore.createIndex(column, column, { unique: false });
            });
        });
    };
}

// function getObjectStore(store_name, mode) {
//     var tx = db.transaction(store_name, mode);
//     return tx.objectStore(store_name);
// }

// function clearObjectStores() {
//     var store = getObjectStore(DB_STORE_NAME, 'readwrite');
//     var req = store.clear();
//     req.onsuccess = function (evt) {
//         displayActionSuccess("Store cleared");
//         displayPubList(store);
//     };
//     req.onerror = function (evt) {
//         console.error("clearObjectStore:", evt.target.errorCode);
//         displayActionFailure(this.error);
//     };
// }

function processData() {
    cl("| Starting processing data");
    processDesktopIcons();
    cl("Desktop Icons processed")
}

function processDesktopIcons() {
    desktopIcons.forEach(function (item) {
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
            cl("Open Window from Desktop\n", holder);
        });
        holder.addEventListener('contextmenu', function (event) {
            cl("Open ContextMenu from Desktop\n", holder);
            event.preventDefault();
        });

        let icon = document.createElement("img");
        icon.src = item.icon;
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
        holder.appendChild(caption);

        let textarea = document.createElement("textarea");
        textarea.name = "icon-name";
        textarea.readOnly = true;
        textarea.textContent = item.name;
        caption.appendChild(textarea);

        desktop.appendChild(holder);
    });
}