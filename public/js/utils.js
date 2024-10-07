"use strict";

const getDirectory = () => {
    if (!window.showDirectoryPicker) {
        alert('Unsupported Browser Notice');
        return;
    }
    const verify = confirm('Ask user to confirm');
    if (!verify) return 'File picker canceled.';
    return window.showDirectoryPicker();
};

async function updateDirectory() {
    const directoryHandle = await getDirectory();
    cl('directoryHandle', directoryHandle);
    for await (let handle of directoryHandle.values()) {
        cl('handle', handle);
    }
}

function bool(value) {
    return (/true/).test(value);
}

// const isElementLoaded2 = async selector => {
//     while (document.querySelector(selector) === null) {
//         await new Promise(resolve => requestAnimationFrame(resolve))
//     }
//     return document.querySelector(selector);
// };

// const isElementLoaded = async selector => {
//     while (selector === null) {
//         await new Promise(resolve => requestAnimationFrame(resolve))
//     }
//     return selector;
// };


// function auto_grow(element) {
//     element.style.height = "1px !important";
//     element.style.height = (element.scrollHeight) + "px !important";
// }

function cssVar(variableName, value = null) {
    if (value !== null) {
        document.documentElement.style.setProperty(variableName, value);
    } else {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName);
    }
}

function deselectSelectedOrOpen() {
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

function textSelect(field, start, end) {
    if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end - start);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}

function textDeSelect() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    else if (document.selection) {
        document.selection.empty();
    }
}

setInterval(function () {
    var dt = new Date();
    document.getElementById("datetime").innerHTML = (("0" + dt.getHours()).slice(-2)) + ":" +
        (("0" + dt.getMinutes()).slice(-2)) + ":" + (("0" + dt.getSeconds()).slice(-2)) + "<br>" + (("0" + dt.getDate()).slice(-2)) + "." + (("0" +
            (dt.getMonth() + 1)).slice(-2)) + "." + (dt.getFullYear());
}, 999);

function cl() {
    if (DEBUG) {
        console.log(...arguments);
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

function deleteDb() {
    let time1 = new Date();
    return new Promise((resolve) => {
        function success() {
            cl("|📗 Database cleared in " + (new Date() - time1) + "ms");
            resolve();
        }
        var req = indexedDB.deleteDatabase("ZWA");
        req.onsuccess = success();
    });
}

function openDb() {
    let time1 = new Date();
    let localDatabaseRequest = indexedDB.open(dbName, 1);

    localDatabaseRequest.onsuccess = function () {
        localDatabase = this.result;

        localDatabase.getStore = function (store, readonly_readwrite = "readwrite") {
            return localDatabase.transaction(store, readonly_readwrite).objectStore(store);
        };

        localDatabase.add = function (store, item) {
            return new Promise((resolve) => {
                let dbStore = localDatabase.getStore(store);
                function success(event) {
                    return resolve(event);
                }
                dbStore.add(item);
                dbStore.transaction.oncomplete = (event) => success(event);
            });
        }

        localDatabase.getColumn = function (store, column, filter = null) {
            return new Promise(function (resolve) {
                let dbStore = localDatabase.getStore(store);
                let dbIndex = dbStore.index(column);
                let result = [];

                function success(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        // cl(" - item: ", cursor.value);
                        result.push(cursor.value)
                        cursor.continue();
                    } else {
                        // cl("Entries all displayed.");
                        return resolve(result);
                    }
                }
                if (filter !== null) {
                    let dbRange = IDBKeyRange.only(filter);
                    let dbCursor = dbIndex.openCursor(dbRange).onsuccess = (event) => success(event);
                    // cl(dbCursor);
                } else {
                    let dbCursor = dbIndex.openCursor().onsuccess = (event) => success(event);
                    // cl(dbCursor);
                }
            });
        }
        // localDatabase.stores = new Map();
        // [...localDatabase.objectStoreNames].forEach((el) => {
        //     localDatabase.stores.set(el, localDatabase.transaction(el, "readwrite").objectStore(el));
        // })
        localDatabase.onclose = function (event) {
            cl("! Spojení s databází bylo přerušeno", event);
        }
        localDatabase.onerror = function (event) {
            cl("! Nastala chyba v databázi:", event.target?.error);
        };
        cl("|📗 indexedDB Ready in " + (new Date() - time1) + "ms");
    };

    localDatabaseRequest.onerror = function (event) {
        cl("Prohlížeč pravděpodobně nepodporuje nebo je zakázaná IndexedDB", event.target.error?.message);
    };

    localDatabaseRequest.onupgradeneeded = function (event) {
        let dbStore;
        dbStores.forEach((currentStore) => {
            // cl("Creating with key: ", currentStore?.keyPath);
            dbStore = event.currentTarget.result.createObjectStore(currentStore.name, { keyPath: currentStore.keyPath, autoIncrement: false });
            currentStore.columns.forEach((column) => {
                dbStore.createIndex(column, column, { unique: false });
            });
            // dbStore.createIndex("test", ['type','colour','ageRange'], { unique: false });
        });
    };
}

function getIcon(node) {
    if (node.icon) {
        return node.icon;
    } else {
        switch (node.type) {
            case "trash":
                return "./media/file-icons/trash.webp";
            case "link":
                if (node.data[0]) {
                    switch (node.data[0].split(":\/\/").shift()) {
                        case "vLinkTrash":
                            return "./media/file-icons/trash.webp";
                        default:
                            return "./media/file-icons/unknown.webp"
                    }
                } else {
                    return "./media/file-icons/link.webp";
                }
            case "folder":
            case "images":
            case "documents":
                return "./media/file-icons/folder.webp";
            case "pdf":
                return "./media/file-icons/pdf.webp";
            case "file":
                if (node.name) {
                    switch (node.name.split(".").pop()) {
                        case "txt":
                            return "./media/file-icons/text.webp";
                        case "pdf":
                            return "./media/file-icons/pdf.webp";
                        default:
                            return "./media/file-icons/unknown.webp"
                    }
                } else {
                    return "./media/file-icons/unknown.webp"
                }
            default:
                return "./media/file-icons/unknown.webp";
        }
    }
}

function closeApp(element) {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        let app = event.target;
        while (!app.classList.contains("windows-app")) {
            app = app.parentElement;
        }
        app.classList.add("closing");
        setTimeout(() => {
            app.remove();
        }, 250);
    });
}

function dragApp(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.querySelector(".app-header").onmousedown = dragMouseDown;

    function dragMouseDown(event) {
        event.preventDefault();
        let app = event.target;
        while (!app.classList.contains("windows-app")) {
            app = app.parentElement;
        }
        app.classList.add("dragging");
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(event) {
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement(event) {
        let app = event.target;
        while (!app.classList.contains("windows-app")) {
            app = app.parentElement;
        }
        app.classList.remove("dragging");

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function desktopIconSelect(element) {
    element.addEventListener("click", (event) => {
        if (!is_key_down('Control')) {
            deselectSelectedOrOpen();
        }
        element.classList.add("icon-selected");
        event.stopPropagation();
    })
}

function desktopIconOpen(element) {
    element.addEventListener("dblclick", (event) => {
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

function desktopIconContextMenu(element) {
    element.addEventListener('contextmenu', function (event) {
        cl("Open ContextMenu from Desktop\n", element);
        event.preventDefault();
    });
}

function desktopIconEditName(element) {
    element.addEventListener("dblclick", (event) => {
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
// var rgb = getAverageRGB(document.getElementById('i'));
// document.body.style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';

// function getAverageRGB(imgEl) {

// var blockSize = 5, // only visit every 5 pixels
//     defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
//     canvas = document.createElement('canvas'),
//     context = canvas.getContext && canvas.getContext('2d'),
//     data, width, height,
//     i = -4,
//     length,
//     rgb = {r:0,g:0,b:0},
//     count = 0;
    
// if (!context) {
//     return defaultRGB;
// }

// height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
// width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

// context.drawImage(imgEl, 0, 0);

// try {
//     data = context.getImageData(0, 0, width, height);
// } catch(e) {
//     /* security error, img on diff domain */alert('x');
//     return defaultRGB;
// }

// length = data.data.length;

// while ( (i += blockSize * 4) < length ) {
//     ++count;
//     rgb.r += data.data[i];
//     rgb.g += data.data[i+1];
//     rgb.b += data.data[i+2];
// }

// // ~~ used to floor values
// rgb.r = ~~(rgb.r/count);
// rgb.g = ~~(rgb.g/count);
// rgb.b = ~~(rgb.b/count);

// return rgb;

// }







// function get_average_rgb(img) {
//     var context = document.createElement('canvas').getContext('2d');
//     if (typeof img == 'string') {
//         var src = img;
//         img = new Image;
//         img.setAttribute('crossOrigin', ''); 
//         img.src = src;
//     }
//     context.imageSmoothingEnabled = true;
//     context.drawImage(img, 0, 0, 1, 1);
//     return context.getImageData(0, 0, 1, 1).data.slice(0,3);
// }