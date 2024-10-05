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

const isElementLoaded2 = async selector => {
    while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector);
};

const isElementLoaded = async selector => {
    while (selector === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return selector;
};


function auto_grow(element) {
    element.style.height = "1px !important";
    element.style.height = (element.scrollHeight) + "px !important";
}

function cssVar(variableName, value) {
    document.querySelector(':root').style.setProperty(variableName, value)
}

function deselectIcons() {
    document.querySelectorAll("figure.icon.icon-selected").forEach((el) => {
        el.classList.remove("icon-selected");
    });
}

const is_key_down = (() => {
    const state = {};
    window.addEventListener('keyup', (e) => {
        state[e.key] = false;
        // cl(e.key + " " + state[e.key]);
    });
    window.addEventListener('keydown', (e) => {
        state[e.key] = true;
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
            cl("|<Database cleared in " + (new Date() - time1) + "ms");
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
        cl("|<indexedDB Ready in " + (new Date() - time1) + "ms");
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