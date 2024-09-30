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

// desktop.querySelectorAll(".icon figcaption textarea").forEach((el) => {
//     el.addEventListener("input", (event) => {
//         auto_grow(event.target)
//     })
//     // isElementLoaded(el).then((selector) => {
//     //     auto_grow(selector)
//     // })
//     el.addEventListener("focusout", (event) => {
//         // event.srcElement.style.height = "2lh";
//     })
//     el.addEventListener("click", (event) => {
//         // event.preventDefault();
//     })
// });

// function findParentByTag(element, tag) {
//     while (element.tagName !== tag) {
//         element = element.parentElement;
//     }
//     return element;
// }

function cl() {
    console.log(...arguments);
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

function openDb() {
    let localDatabaseRequest = indexedDB.open(dbName, 1);

    localDatabaseRequest.onsuccess = function () {
        localDatabase = this.result;
        localDatabase.getStore = function (store, readonly_readwrite = "readwrite") {
            return localDatabase.transaction(store, readonly_readwrite).objectStore(store);
        };
        // localDatabase.stores = new Map();
        // [...localDatabase.objectStoreNames].forEach((el) => {
        //     localDatabase.stores.set(el, localDatabase.transaction(el, "readwrite").objectStore(el));
        // })
    };

    localDatabaseRequest.onerror = function (event) {
        cl("Prohlížeč nepodporuje nebo je zakázaná IndexedDB\nVýjimečně může být strana v kódu stránky\n", event.target.error?.message);
    };

    localDatabaseRequest.onupgradeneeded = function (event) {
        let dbStore;
        dbStores.forEach((element) => {
            dbStore = event.currentTarget.result.createObjectStore(element.name, { keyPath: "id", autoIncrement: false });
            element.columns.forEach((column) => {
                dbStore.createIndex(column, column, { unique: false });
            });
        });
    };
}
