"use strict";

/**
 * @file Utility file for a lot of function etc.
 * @author Jan Oskar Bukovský
 */


/**
 * A flag to enable or disable debug mode.
 * @constant {boolean}
 */
const DEBUG = false;

// Remove usual way of showing context menu on right click
// TODO: remove
if (true || !DEBUG) {
    window.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

/**
 * The function `cl` logs the `arguments` to the console if the `DEBUG` variable is true.
 */
function cl() {
    if (DEBUG) {
        console.log(...arguments);
    }
}

/**
 * The function `sleep` returns a promise that resolves after a specified number of milliseconds.
 * 
 * @param ms The `ms` parameter in the `sleep` function represents the number of milliseconds for which
 * the function will pause or sleep before resolving the promise.
 * 
 * @return The `sleep` function is returning a Promise.
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

/**
 * The function checks if the input value contains the string "true".
 * @param value - The `bool` function you provided checks if the input `value` contains the boolish
 * "true" using a regular expression test.
 * @returns The function `bool` is returning a boolean value indicating boolishness
 */
function bool(value) {
    return (/true/).test(value);
}

/**
 * The `cssVar` function allows you to get or set the value of a CSS variable on the root element of
 * the document.
 * @param variableName - The `variableName` parameter in the `cssVar` function is a string representing
 * the name of the CSS variable whose value you want to retrieve or set. For example, if you have a CSS
 * variable defined as `--main-color`, you would pass `'--main-color'` as the `
 * @param [value=null] - The `value` parameter in the `cssVar` function is the new value that you want
 * to set for the CSS variable identified by `variableName`. If you provide a `value`, the function
 * will update the CSS variable with that new value. If you don't provide a `value`, the
 * @returns The `cssVar` function is returning the value of the CSS variable with the name specified in
 * the `variableName` parameter.
 */
function cssVar(variableName, value = null) {
    if (value !== null) {
        document.documentElement.style.setProperty(variableName, value.toString());
    } else {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName);
    }
}

/**
 * The function `textSelect` is used to programmatically select a range of text within a text input
 * field.
 * @param field - The `field` parameter in the `textSelect` function represents the input field or
 * textarea element in which you want to select text. This field could be a reference to the DOM
 * element itself.
 * @param start - The `start` parameter in the `textSelect` function represents the starting index or
 * position within the text field where the selection should begin. This index is typically a numeric
 * value indicating the character position within the text field.
 * @param end - The `end` parameter in the `textSelect` function represents the end position of the
 * text selection within the specified input field. It indicates the index of the character where the
 * selection should end.
 */
function textSelect(field, start, end) {
    if (field.createTextRange) {
        const selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart("character", start);
        selRange.moveEnd("character", end - start);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}

/**
 * The function `textDeSelect` is used to clear any text selection on a webpage.
 */
function textDeSelect() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    else if (document.selection) {
        document.selection.empty();
    }
}

/**
 * The function `pageInIframe` checks if the current page is being displayed within an iframe.
 * @returns The function `pageInIframe()` is checking if the current page is being displayed within an
 * iframe. It returns `true` if the page is inside an iframe, and `false` if it is not.
 */
function pageInIframe() {
    return (window.self !== window.top)
}

/**
 * The function `timestampToHuman` converts a timestamp into a human-readable date and time format in
 * Czech language.
 * @param timestamp - The `timestamp` parameter in the `timestampToHuman` function is a Unix timestamp
 * representing a specific date and time. It is the number of seconds that have elapsed since January
 * 1, 1970, at 00:00:00 UTC. The function takes this timestamp and converts it into
 * @returns The `timestampToHuman` function returns a formatted date and time string in the format
 * "DDMMMYYYY HH:MM:SS" (e.g., "25.10.2022 14:30:45") based on the provided timestamp.
 */
function timestampToHuman(timestamp) {
    const date = new Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(timestamp).replaceAll(" ", "")
    const time = new Intl.DateTimeFormat("cs-CZ", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    }).format(timestamp);
    return date + " " + time;
}

/**
 * The function `appendBefore` inserts an element before a specified element in the DOM.
 * @param element - The `element` parameter in the `appendBefore` function is the element that you want
 * to insert before another element in the DOM.
 * @param beforeWhat - The `beforeWhat` parameter in the `appendBefore` function is the element before
 * which you want to insert the new element.
 * @returns The function `appendBefore` is returning the element that was inserted before the
 * `beforeWhat` element.
 */
function appendBefore(element, beforeWhat) {
    return beforeWhat.parentNode.insertBefore(element, beforeWhat);;
}

/**
 * The `scaleValue` function scales a given value from one range to another range.
 * @param value - The `value` parameter represents the value that you want to scale from one range to
 * another.
 * @param from - The `from` parameter in the `scaleValue` function represents the range of the input
 * values that you want to scale. It is an array with two elements: the minimum and maximum values of
 * the input range.
 * @param to - The `to` parameter in the `scaleValue` function represents the range to which you want
 * to scale the input value. It is an array containing two elements - the minimum and maximum values of
 * the desired output range.
 * @returns The function `scaleValue` returns the scaled value based on the input value, the range it
 * is coming from (`from`), and the range it needs to be scaled to (`to`).
 */
function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
}

/**
 * The function `sha256Hash` asynchronously generates a SHA-256 hash for the input text using the Web
 * Crypto API in JavaScript.
 * @param text - The `sha256Hash` function you provided is an asynchronous function that calculates the
 * SHA-256 hash of the input text using the Web Crypto API. The function takes a `text` parameter,
 * which is the input text for which you want to calculate the SHA-256 hash.
 * @returns The `sha256Hash` function returns a Promise that resolves to the SHA-256 hash of the input
 * `text` as a hexadecimal string.
 */
async function sha256Hash(text) {
    return Array.from(new Uint8Array(await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* A function `is_key_down` that checks whether a specific key is currently
being pressed on the keyboard. It uses event listeners for keyup and keydown events to update the
state of keys being pressed or released. The function returns `true` if the specified key is
currently pressed, and `false` otherwise. */
const is_key_down = (() => {
    const state = {};
    window.addEventListener("keyup", (event) => {
        state[event.key] = false;
        // cl(event.key + " " + state[event.key]);
    });
    window.addEventListener("keydown", (event) => {
        state[event.key] = true;
        // cl(event.key + " " + state[event.key]);
    });
    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

/**
 * The function `sizeNumberToString` converts a given size number into a formatted string with an
 * appropriate size prefix.
 * @param size - It seems like you have not provided the value for the `size` parameter in the
 * `sizeNumberToString` function. Please provide the value of `size` so that I can help you convert it
 * to a formatted string representation with the appropriate size prefix.
 * @returns The function `sizeNumberToString` returns a string that represents the given size number in
 * a human-readable format with the appropriate size prefix. The size is converted to a smaller unit if
 * necessary, and the result is rounded to two decimal places. The returned string includes the
 * converted size and the corresponding size prefix.
 */
function sizeNumberToString(size) {
    let prefix = 0;
    let stage = Object.values(sizePrefixes)[1];
    while (size / stage >= 1) {
        size /= stage;
        prefix++;
    }
    return "" + parseFloat(size.toFixed(2)) + " " + Object.keys(sizePrefixes)[prefix];
};

/**
 * The function `setCookie` is used to set a cookie with a specified name, value, and expiry time in
 * hours.
 * @param name - The `name` parameter in the `setCookie` function represents the name of the cookie you
 * want to set. It is a string that identifies the cookie and allows you to retrieve its value later.
 * @param value - The `value` parameter in the `setCookie` function represents the value you want to
 * store in the cookie. It could be a string, number, or any other data type that you want to associate
 * with the cookie name.
 * @param expiryHours - The `expiryHours` parameter in the `setCookie` function represents the number
 * of hours after which the cookie will expire. This value is used to calculate the expiration time for
 * the cookie by converting it to milliseconds and adding it to the current time.
 * @returns The function `setCookie` is returning `true` after setting the cookie with the provided
 * name, value, and expiry time.
 */
function setCookie(name, value, expiryHours) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryHours * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    return true;
}

/**
 * The function `getCookie` retrieves the value of a cookie by its name from the document's cookies.
 * @param name - The `getCookie` function you provided is used to retrieve a cookie value by its name
 * from the `document.cookie` string. The `name` parameter in this function represents the name of the
 * cookie whose value you want to retrieve.
 * @returns If the cookie with the specified name is found, the function will return the value of that
 * cookie. If the cookie is not found, the function will return null.
 */
function getCookie(name) {
    name = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * The function `isValidUrl` checks if a given string is a valid URL starting with either "http://" or
 * "https://".
 * @param string - The `isValidUrl` function takes a string as a parameter and checks if it represents
 * a valid URL with either the "http" or "https" protocol. If the string can be successfully parsed as
 * a URL using the `URL` constructor without throwing an error, and the protocol of the URL is
 * @returns The function `isValidUrl` returns a boolean value. It returns `true` if the input string is
 * a valid URL with either "http:" or "https:" protocol, and `false` otherwise.
 */
function isValidUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * The function `stripPx` takes an element, a style type, and a default value, and returns the
 * numerical value of the specified style property without the "px" unit if present, or the default
 * value if the style property is not set.
 * @param element - The `element` parameter represents the HTML element whose style property you want
 * to access.
 * @param styleType - The `styleType` parameter in the `stripPx` function refers to the CSS style
 * property that you want to extract the pixel value from. For example, if you want to get the pixel
 * value of the `width` property of an element, you would pass `'width'` as the `styleType
 * @param defaultValue - The `defaultValue` parameter is the value that will be returned if the
 * `element` does not have the specified `styleType` in pixels.
 * @returns The function `stripPx` returns the numerical value of a CSS property of an element, without
 * the "px" unit. If the property is not set, it returns the `defaultValue` provided as an argument.
 */
function stripPx(element, styleType, defaultValue) {
    return element.style[styleType] ? Number(element.style[styleType].replace("px", "")) : defaultValue;
}

/**
 * The function `getParam` retrieves a specific parameter value from the URL query string.
 * @param param - The `getParam` function is designed to retrieve a specific parameter value from the
 * query string of the current URL. The `param` parameter in this function should be a string
 * representing the name of the parameter you want to retrieve from the URL.
 * @returns The `getParam` function is returning the value of the specified parameter from the query
 * string of the current URL.
 */
function getParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

/**
 * The `setupClock` function creates a clock and a tooltip displaying the current date and time in
 * cs-CZ format.
 */
function setupClock() {
    clock();
    clockTooltip();
    function clock() {
        const datetime = new Date();
        const date = new Intl.DateTimeFormat("cs-CZ", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(datetime).replaceAll(" ", "")
        const time = new Intl.DateTimeFormat("cs-CZ", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(datetime)
        const element = document.querySelector("#datetime");
        element.setAttribute("data-date", date);
        element.setAttribute("data-time", time + " ");
        setTimeout(() => {
            clock();
        }, 1001 - datetime.getMilliseconds());
    }
    function clockTooltip() {
        const datetime = new Date();
        const date = new Intl.DateTimeFormat("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(datetime);
        const time = new Intl.DateTimeFormat("cs-CZ", {
            weekday: "short",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(datetime) + " (Místní čas)"
        const element = document.querySelector(".time-tooltip");
        element.children[0].textContent = date;
        element.children[1].textContent = time;
        setTimeout(() => {
            clockTooltip();
        }, 1001 - datetime.getMilliseconds());
    }
}

/**
 * The function `deleteDb` deletes a database and resolves a promise once the operation is successful.
 * @returns A Promise is being returned from the deleteDb function.
 */
function deleteDb() {
    let time1 = new Date();
    return new Promise((resolve) => {
        function success() {
            cl("|📗 Database cleared in " + (new Date() - time1) + "ms");
            resolve();
        }
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = success();
    });
}

/**
 * The function `openDbError` displays an error message when unable to connect to a database within a
 * specified time limit.
 * @param timeout - The `timeout` parameter in the `openDbError` function represents the time limit in
 * seconds for connecting to the database before an error is triggered.
 */
function openDbError(timeout) {
    cl("!📕 Nedaří se připojit k databázi v časovém limitu: " + timeout + "s");
    cssVar("--db-error", '"Nedaří se připojit k databázi [V časovém limitu ' + timeout + 's]: \\a Zavřete ostatní okna s aplikací"');
    const errorsElement = document.querySelector(".errors");
    errorsElement.classList.remove("hidden")
    errorsElement.classList.add("db-error");
}

/**
 * The function `openDb` opens a database and resolves a promise once the operation is successful.
 * Plus some extra features
 * @returns A Promise is being returned from the openDb function.
 */
function openDb() {
    let time1 = new Date();
    let localDatabaseRequest = indexedDB.open(dbName, 1);
    const errorsElement = document.querySelector(".errors");

    localDatabaseRequest.onerror = function (event) {
        cl("!📕 Prohlížeč pravděpodobně nepodporuje nebo je zakázaná IndexedDB: ", event);
        cssVar("--db-error", '"Prohlížeč pravděpodobně nepodporuje nebo je zakázaná IndexedDB"');

        errorsElement.classList.remove("hidden")
        errorsElement.classList.add("db-error");
    };

    localDatabaseRequest.onblocked = function (event) {
        cl("!📕 Nelze navázat spojení s databází: ", event);
        cssVar("--db-error", '"Nelze navázat spojení s databází"');

        errorsElement.classList.remove("hidden")
        errorsElement.classList.add("db-error");
    };

    localDatabaseRequest.onupgradeneeded = function (event) {
        let dbStore;
        dbStores.forEach((currentStore) => {
            dbStore = event.currentTarget.result.createObjectStore(currentStore.name, { keyPath: currentStore.keyPath, autoIncrement: false });
            currentStore.columns.forEach((column) => {
                dbStore.createIndex(column, column, { unique: false });
            });
        });
    };

    return new Promise(resolve => {
        localDatabaseRequest.onsuccess = function (event) {
            localDatabase = this.result;

            localDatabase.onversionchange = (event) => {
                cl("|📘 A new version of this page is ready. Please reload or close this tab!");
                localDatabase.close();
                openDb();
                addNotification({ "head": "Neaktuální verze aplikace", "body": "Aktualizujte stránku pro aktuální data" }, false, null, "warning");
            };

            /* The above code is defining a function `getStore` on the `localDatabase` object. This
            function takes two parameters: `store` and `readonly_readwrite`, with a default value of
            "readwrite" for the second parameter. The function is likely used to interact with a
            local database, such as IndexedDB, and allows for specifying the access mode (read-only
            or read-write) when accessing the specified store. */
            localDatabase.getStore = function (store, readonly_readwrite = "readwrite") {
                return localDatabase.transaction(store, readonly_readwrite).objectStore(store);
            };

            /* The above code is defining an asynchronous function named `add` on the `localDatabase`
            object. This function takes two parameters: `store` and `item`. Inside the function, it
            is likely adding the `item` to a local database store specified by the `store`
            parameter. The use of `async` keyword indicates that the function will operate
            asynchronously and may involve asynchronous operations like fetching data or interacting
            with a database. */
            localDatabase.add = async function (store, item) {
                return new Promise(async (resolve) => {
                    let dbStore = localDatabase.getStore(store);
                    function success(event) {
                        return resolve(event);
                    }
                    try {
                        dbStore.put(item);
                    } catch (error) {
                        cl("!📕 ERROR: ", error, item);
                    }
                    dbStore.transaction.oncomplete = (event) => success(event);
                });
            }

            /* The code is defining a function `delete` on the `localDatabase` object. The purpose of this function 
            is to delete in item from a given store in a local database. */
            localDatabase.delete = async function (store, items = []) {
                return new Promise(async (resolve) => {
                    let dbStore = localDatabase.getStore(store);
                    function success(event) {
                        return resolve(event);
                    }
                    try {
                        items.forEach((item) => {
                            dbStore.delete(item.uuid);
                        });
                    } catch (error) {
                        cl("!📕 ERROR: ", error, items);
                    }
                    dbStore.transaction.oncomplete = (event) => success(event);
                });
            }

            /* The code is defining a function `update` on the `localDatabase` object. The purpose of this function 
            is to update column from a given store in a local database. */
            localDatabase.update = async function (store, column, filter, keys = [], values = []) {
                return new Promise(async (resolve) => {
                    let item = (await localDatabase.getColumn(store, column, filter))[0];
                    let dbStore = localDatabase.getStore(store);
                    function success(event) {
                        return resolve(event);
                    }
                    try {
                        if (keys.length != values.length) {
                            throw "Keys and values must have the same length";
                        }
                        keys.forEach((key, index) => {
                            item[key] = values[index];
                        })
                        dbStore.put(item);
                    } catch (error) {
                        cl("!📕 ERROR: ", error, item);
                    }
                    dbStore.transaction.oncomplete = (event) => success(event);
                });
            }

            /* The code is defining a function `getColumn` on the `localDatabase` object. This
            function takes three parameters: `store`, `column`, and `filter`, with `filter` having a
            default value of `null`. The purpose of this function is to retrieve a specific column
            from a given store in a local database. If a `filter` is provided, it can be used to
            further refine the results. */
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
            localDatabase.onclose = function (event) {
                cl("!📕 Spojení s databází bylo přerušeno: ", event);
                cssVar("--db-error", '"Spojení s lokální databází bylo přerušeno"');

                if (errorsElement) {
                    errorsElement.classList.remove("hidden")
                    errorsElement.classList.add("db-error");
                }
            }
            localDatabase.onerror = function (event) {
                cl("!📕 Nastala chyba v databázi: ", event);
                cssVar("--db-error", '"Nastala chyba v databázi: \\a ' + event.target.error + '"');

                if (errorsElement) {
                    errorsElement.classList.remove("hidden")
                    errorsElement.classList.add("db-error");
                }

            };
            cl("|📗 indexedDB Ready in " + (new Date() - time1) + "ms");
            resolve();
        };
    });
}

/**
 * The function `getIconTooltipText` generates desktop icon tooltip text used for showing user some basic file info
 * @param node - The `node` arguments is user to determine vNode user wants to see details
 * @returns The `getIconTooltipText` function is returning string of tooltip content
 */
async function getIconTooltipText(node) {
    node = (await localDatabase.getColumn("vNodes", "uuid", node.uuid))[0];
    switch (node.type) {
        case "folder":
        case "images":
        case "documents":
            return node.name + "\r\nDatum vytvoření: " + timestampToHuman(node.timeCreate) + "\r\nVelikost: " + sizeNumberToString(node.size);
        case "file":
            return node.name + "\r\n" + node.description + "\r\nVelikost: " + sizeNumberToString(node.size) + "\r\nDatum změny: " + timestampToHuman(node.timeEdit);
        case "link":
            return "Odkaz na: " + node.data.data[0];
        default:
            return "Soubor";
    }
}

/**
 * The function `getDestination` generates iframe url to load
 * @param node - The `node` arguments is user to determine vNode user wants to get url
 * @param options - The `options` arguments is user to determine additional options for url generation
 * @returns The `getDestination` function is returning string representation of URL for iframe
 */
function getDestination(node, options = {}) {
    switch (node.type) {
        case "link":
            switch (node.data.data[0].split(":\/\/").shift()) {
                case "vLinkTrash":
                    // return location.origin + "/~bukovja4/public/" + node.owner + node.data.data[0] + node.name;
                    return location.origin + "/~bukovja4/public/viewer.php?uuid=" + node.uuid + "&warning=js-not-implemented-for-now";
                    return ""
                case "admin":
                    return location.origin + "/~bukovja4/public/administration.php";
                case "games":
                    switch (node.data.data[0].match("(?<=:\/\/).*?(?=(\/|$))")[0]) {
                        case "minecraft":
                            return "https://eaglercraft.com/mc/1.8.8-wasm/";
                        case "ice-hockey":
                            return location.origin + "/~bukovja4/public/extra/svine_klouzavy.html";
                        default:
                            return location.origin + "/~bukovja4/public/extra/" + node.data.data[0].match("(?<=:\/\/).*?(?=(\/|$))")[0] + ".html";
                    }
                case "vComputer":
                    return location.origin + "/~bukovja4/public/explorer.php?folder=" + node.owner;
                case "http":
                case "https":
                    return node.data.data[0];
                default:
                    cl("should not happen");
                // return location.origin + "/~bukovja4/public/user-data/" + node.owner + node.data.data[0] + node.name;
            }
            break;
        case "images":
        case "documents":
        case "desktop":
        case "folder":
            // + node.data.data[0].replace("vComputer://", "")
            return location.origin + "/~bukovja4/public/explorer.php?folder=" + node.uuid;
            break;
        case "file":
            if (options?.edit == true) {
                return location.origin + "/~bukovja4/public/viewer.php?uuid=" + node.uuid + "&edit=true";
            }
            return location.origin + "/~bukovja4/public/viewer.php?uuid=" + node.uuid
        default:
            return location.origin + "/~bukovja4/public/viewer.php?uuid=" + node.uuid + "&warning=js-unknown-type";
    }
    // return location.origin + "/~bukovja4/public/user-data/" + node.owner + node.data.data[0] + node.name;
}

/**
 * The function `getIcon` generates application icon URL adress
 * @param node - The `node` arguments is user to determine vNode user wants to see icon
 * @returns The `getIcon` function is returning string URL of the icon
 */
function getIcon(node) {
    if (node.icon) {
        return node.icon;
    } else {
        switch (node.type) {
            case "trash":
                return "./media/file-icons/trash.webp";
            case "link":
                if (node.data.data[0]) {
                    switch (node.data.data[0].split(":\/\/").shift()) {
                        case "vLinkTrash":
                            return "./media/file-icons/trash.webp";
                        case "vComputer":
                            return "./media/file-icons/computer.webp";
                        case "admin":
                            return "./media/file-icons/admin.webp";
                        case "games":
                            return "./media/file-icons/" + node.data.data[0].match("(?<=:\/\/).*?(?=(\/|$))")[0] + ".webp";
                        case "http":
                        case "https":
                            let link = node.data.data[0].match("(?<=:\/\/).*?(?=(\/|$))");
                            if (link[0]) {
                                return "https://favicone.com/" + link[0] + "?s=128"
                                // return "https://www.google.com/s2/favicons?domain=" + link[0] + "&sz=128"
                            }
                        default:
                            return "./media/file-icons/unknown.webp"
                    }
                } else {
                    return "./media/file-icons/link.webp";
                }
            case "desktop":
                return "./media/file-icons/desktop.webp";
            case "documents":
                return "./media/file-icons/documents.webp";
            case "images":
                return "./media/file-icons/images.webp";
            case "folder":
                return "./media/file-icons/folder.webp";
            case "file":
                if (node.name) {
                    switch (node.name.split(".").pop()) {
                        case "txt":
                            return "./media/file-icons/text.webp";
                        case "pdf":
                            return "./media/file-icons/pdf.webp";
                        case "jpeg":
                        case "jpg":
                        case "png":
                        case "gif":
                        case "webp":
                            return "./media/file-icons/image.webp";
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

/**
 * The function `bubbleToClass` used for retrieving closest parent containing given class from user event
 * @param event - The `event` arguments determine search starting point, usualy click and its `event.target`
 * @returns The `bubbleToClass` return closes parent of given class relative to event.target source
 */
function bubbleToClass(event, className) {
    let element = event.target;
    while (element && element.classList && !element?.classList?.contains(className)) {
        element = element.parentElement;
        if (element === null) {
            return false;
        }
    }
    return element;
}

/**
 * The function `bubbleToClassFromElement` used for retrieving closest parent containing given class from user element
 * @param start - The `start` arguments determine search starting point
 * @returns The `bubbleToClass` return closes parent of given class relative to start source
 */
function bubbleToClassFromElement(start, className) {
    while (start && start.classList && !start?.classList?.contains(className)) {
        start = start.parentElement;
        if (start === null) {
            return false;
        }
    }
    return start;
}

/**
 * The function `minimizeApp` hooks minimize event listener to controls button
 * @param minimizeButton - The `minimizeButton` event as DOM element to hook event to
 */
function minimizeApp(minimizeButton) {
    minimizeButton.addEventListener("click", (event) => {
        let app = bubbleToClass(event, "windows-app");
        app.classList.toggle("minimized");

        deselectAllApps();
    });
}

// TODO

/**
 * The function `maximizeApp` hooks minimize event listener to controls button
 * @param maximizeButton - The `maximizeButton` event as DOM element to hook event to
 */
function maximizeApp(maximizeButton, header) {
    maximizeButton.addEventListener("click", (event) => {
        bubbleToClass(event, "windows-app").classList.toggle("maximized");
    });
    header.addEventListener("dblclick", (event) => {
        bubbleToClass(event, "windows-app").classList.toggle("maximized");
    });
}

/**
 * The function `closeApp` handle closing of the apps
 * @param target - The `target` as app selector (DOM Element)
 * @param forced - The `forced` bool value indicating if close should be instant
 */
function closeApp(target, forced = false) {
    function close(app, forced = false) {
        if (!forced) {
            app = bubbleToClass(app, "windows-app");
        }
        app.classList.add("closing");
        setTimeout(() => {
            app.remove();
        }, 250);
        const navbarIcon = navbar.querySelector('.navbar-icon[data-uuid="' + app.dataset.uuid + '"]');
        if (navbarIcon) {
            if (navbarIcon.dataset.persistent != "false") {
                navbarIcon.classList.add("closing");
                setTimeout(() => {
                    navbarIcon.remove();
                }, 250);
            }
        }
    }
    if (forced === true) {
        close(target, true);
        return;
    }
    target.onclick = close;
}

/**
 * The function `positionContextMenu` position contextMenu if user hovers over app icon perfectly
 * @param container - The `container` as DOM Element which context menu to position
 * @param appendTo - DOM Icon element to insert contextMenu to
 */
function positionContextMenu(container, appendTo, relativeTo = null) {
    if (!relativeTo) {
        relativeTo = appendTo;
    }
    appendTo.appendChild(container);
    let left = event.clientX + 1 + "px";
    container.style.left = left;
    let bottom = relativeTo.getBoundingClientRect().height - event.clientY + 1;
    if (container.getBoundingClientRect().height >= event.clientY) {
        bottom = relativeTo.getBoundingClientRect().height - container.getBoundingClientRect().height - 1;
    }

    if (container.getBoundingClientRect().right >= relativeTo.getBoundingClientRect().width) {
        left = relativeTo.getBoundingClientRect().width - container.getBoundingClientRect().width - 1;
    }

    container.style.bottom = bottom + "px";
    container.style.left = left + "px";
}

/**
 * The function `dragApp` handles app dragging
 * @param element - The `element` as DOM Element which app behavior to handle
 */
function dragApp(element) {
    let dragging;
    let waitForMove;
    let app;
    let offsetX;
    const header = element.querySelector(".app-header");

    let maximizedOffsetX;

    function dragStart(event, position) {
        dragging = true;
        waitForMove = true;
        app = bubbleToClass(event, "windows-app");

        const max = stripPx(element, "width", 400 + 2);

        offsetX = scaleValue(position[0] - element.offsetLeft, [0, header.offsetWidth], [0, max]);
        if (offsetX < 5) {
            offsetX = 5;
        } else if (offsetX > max - 5) {
            offsetX = max - 5;
        }
        if (app.classList.contains("maximized")) {
            waitForMove = true;
        } else {
            waitForMove = false;
        }
        selectApp(element.dataset.uuid);
    }

    function dragMove(position) {
        if (dragging) {
            if (waitForMove) {
                // cl("fullscreen removing");
                app.classList.remove("maximized");
                waitForMove = false;
                return;
            }
            app.classList.add("dragging");

            element.style.left = (position[0] - offsetX) + "px";
            element.style.top = (position[1] - (header.offsetHeight / 2)) + "px";
        }
    }

    function dragStop() {
        if (app) {
            app.classList.remove("dragging");
        }
        dragging = false;
    }

    const appWindow = element.querySelector(".app-header");
    appWindow.addEventListener("mousedown", (event) => dragStart(event, [event.clientX, event.clientY]));
    appWindow.addEventListener("touchstart", (event) => dragStart(event, [event.touches[0].clientX, event.touches[0].clientY]), { "passive": true });

    window.addEventListener("mousemove", (event) => dragMove([event.clientX, event.clientY]));
    window.addEventListener("touchmove", (event) => dragMove([event.touches[0].clientX, event.touches[0].clientY]));

    window.addEventListener("mouseup", dragStop);
    window.addEventListener("touchend", dragStop);
    window.addEventListener("blur", dragStop);
}

/**
 * The function `dragApp` handles app selection
 * @param uuid - The uuid string to define which app
 */
function selectApp(uuid) {
    const appWindow = windows.querySelector('[data-uuid="' + uuid + '"]');
    appWindow.classList.add("active");
    navbar.querySelector('[data-uuid="' + uuid + '"]').classList.add("active");
    appWindow.style.zIndex = getLowestMaxAppZIndex();
    deselectAllApps('[data-uuid="' + uuid + '"]');
}

/**
 * The function `createElement` handles elements creation
 * @param arguments - Iterate over arguments items to determine how new element shound appears
 * @returns The function `createElement` is returning a DOM Element created
 */
function createElement() {
    let parameters = [...arguments];
    let parameter;
    let element;
    if (!parameters) {
        return null;
    }
    if (parameters.length < 1) {
        return null;
    }
    let elementType = parameters.shift();
    if (typeof elementType === "string") {
        element = document.createElement(elementType);
    } else {
        return null;
    }
    while (parameters.length >= 1) {
        parameter = parameters.shift();
        switch (parameter.constructor) {
            case Id:
                element.id = parameter.id;
                break;
            case Src:
                element.src = parameter.src;
                break;
            case Cols:
                element.cols = parameter.cols;
                break;
            case Name:
                element.name = parameter.name;
                break;
            case ReadOnly:
                element.readOnly = parameter.readOnly;
                break;
            case Type:
                element.type = parameter.type;
                break;
            case TextContent:
                element.textContent = parameter.textContent;
                break;
            case ClassList:
                for (let className of parameter) {
                    element.classList.add(className);
                }
                break;
            case Data:
                element.dataset[parameter.key] = parameter.value;
                break;
            case Alt:
                element.alt = parameter.alt;
                break;
            case AriaHidden:
                element.ariaHidden = parameter.ariaHidden;
                break;
            case ElementEvent:
                element.addEventListener(parameter.type, parameter.handler);
                break;
            case SandBox:
                for (let className of parameter) {
                    element.sandbox.add(className);
                }
                break;
            case AppendTo:
                parameter.element.appendChild(element);
                break;
            default:
                cl("Element construction error: ", parameter);
                break;
        }
    }
    return element;
}

/**
 * The function `closeAllDesktopContextMenus` closes all desktop context menus
 */
function closeAllDesktopContextMenus() {
    desktop.querySelectorAll(".context-menu").forEach((element) => {
        element.classList.remove("open");
        setTimeout(() => element.remove(), 250);
    });
}

/**
 * The function `closeAllExplorerContextMenus` closes all explorer context menus
 */
function closeAllExplorerContextMenus() {
    files.querySelectorAll(".context-menu").forEach((element) => {
        element.classList.remove("open");
        setTimeout(() => element.remove(), 250);
    });
}

/**
 * The function `deselectAllApps` deselects all unwanted apps
 * @param exceptSelector - CSS selector to ignore some apps
 */
function deselectAllApps(exceptSelector) {
    windows.querySelectorAll(".windows-app.active:not(" + exceptSelector + ")").forEach((app) => {
        app.classList.remove("active");
    });
    navbar.querySelectorAll("div.active:not(" + exceptSelector + ")").forEach((element) => {
        element.classList.remove("active")
    });
}

/**
 * The function `closeDesktopCalendar` closes calendar
 */
function closeDesktopCalendar() {
    navbar.querySelector(".calendar-container").classList.remove("open");
}

/**
 * The function `closeSearchbarMenu` closes search menu
 */
function closeSearchbarMenu() {
    navbar.querySelector(".search-menu")?.classList.remove("open");
    if (navbar.querySelector(".navbar-search input[type=search]")) {
        navbar.querySelector(".navbar-search input[type=search]").value = "";
    }
}

/**
 * The function `closeMainMenu` closes main menu
 */
function closeMainMenu() {
    navbar.querySelector(".main-menu").classList.remove("open");
}

/**
 * The function `closeScreenMenu` closes screen brightness menu
 */
function closeScreenMenu() {
    navbar.querySelector(".screen-menu").classList.remove("open");
}

/**
 * The function `desktopIconTooltip` handles tooltip behavior
 * @param element - DOM Element to register handlers to
 * @param node - The `node` arguments is user to determine vNode user may request to see tooltip of
 */
function desktopIconTooltip(element, node) {
    let tooltipTimer, tooltipX, tooltipY;

    element.addEventListener("mouseenter", async () => {
        tooltipTimer = new Date();
        const tooltip = createElement("div", new ClassList("icon-tooltip", "no-select"), new AppendTo(element), new TextContent(await getIconTooltipText(node)));
        setTimeout(() => {
            if (tooltip && desktop.querySelectorAll(".context-menu").length == 0 && element.querySelectorAll("textarea:not(:read-only)").length == 0) {
                tooltip.style.left = tooltipX + "px";
                tooltip.style.top = "calc(1.5rem + " + tooltipY + "px)";
                tooltip.classList.add("active");
            }
        }, 900);
    });

    element.addEventListener("mousemove", () => {
        if (new Date() - tooltipTimer <= 900) {
            tooltipX = event.clientX;
            tooltipY = event.clientY;
        }
    });

    element.addEventListener("mouseleave", () => {
        const tooltip = element.querySelector(".icon-tooltip");
        if (tooltip) {
            if (tooltip.classList.contains("active")) {
                tooltip.classList.remove("active");
                setTimeout(() => tooltip.remove(), 250);
            } else {
                tooltip.remove();
            }
        } else {
            // cl("unable to remove icon tooltip", event, tooltip);
            setTimeout(() => {
                if (tooltip) {
                    tooltip.remove()
                }
            }, 250);
        }
    });
}

function resizeWindow(app) {
    resizingElementsPrefixes.forEach((item) => {
        const grip = createElement("div", new ClassList("resizable", item + "-grip"), new AppendTo(app));
        grip.addEventListener("mousedown", appResizeDown);
        window.addEventListener("mouseup", appResizeUp);
    });
}

let appResizing = {
    top: null,
    left: null,
    width: null,
    height: null,
    _status: false,
    element: null,
    grip: null,
    app: null,
    maxX: null,
    maxY: null,
    boundingBox: null,
    /**
    * Updates the maximum dimensions (maxX and maxY) based on the size of the free space for apps.
    */
    windowResize: function () {
        const defaultAppsSizes = document.querySelector("#windows").getBoundingClientRect();
        this.maxX = defaultAppsSizes.width;
        this.maxY = defaultAppsSizes.height;
    },
    /**
    * Resizes the application window based on the mouse event and the grip direction.
    * @param {MouseEvent} event - The mouse event containing the cursor position.
    */
    resizingEvent: function (event) {
        let x = event.pageX < 0 ? 0 : event.pageX;
        let y = event.pageY < 0 ? 0 : event.pageY;

        if (x > appResizing.maxX) {
            x = appResizing.maxX;
        }
        if (y > appResizing.maxY) {
            y = appResizing.maxY;
        }

        if (!appResizing.grip) {
            // cl("no grip");
            return;
        }
        let headerBoundingBox = appResizing.app.querySelector(".app-header").getBoundingClientRect();
        appResizing.grip.split("").forEach(grip => {
            switch (grip) {
                case "n":
                    // cl("nahoře", appResizing.boundingBox, "\n", `${x}:${y}`);
                    let height = (appResizing.boundingBox.top - y) + appResizing.boundingBox.height - 2;
                    if (height < 300) {
                        height = 300
                    }
                    let top = y;
                    if (y + 303 + headerBoundingBox.height > appResizing.boundingBox.bottom) {
                        top = appResizing.boundingBox.bottom - headerBoundingBox.height - 303;
                    }
                    appResizing.app.style.top = top + "px";
                    appResizing.app.style.height = height + "px";
                    break;
                case "e":
                    // cl("pravá", appResizing.boundingBox, "\n", `${x}:${y}`);
                    appResizing.app.style.width = x - appResizing.boundingBox.left + "px";
                    break;
                case "s":
                    // cl("dole", appResizing.boundingBox, "\n", `${x}:${y}`);
                    appResizing.app.style.height = y - appResizing.boundingBox.top + "px";
                    break;
                case "w":
                    // cl("levá", appResizing.boundingBox, "\n", `${x}:${y}`);
                    let width = (appResizing.boundingBox.left - x) + appResizing.boundingBox.width - 2;
                    if (width < 400) {
                        width = 400
                    }
                    let left = x;
                    if (x + 402 > appResizing.boundingBox.right) {
                        left = appResizing.boundingBox.right - 402;
                    }
                    appResizing.app.style.left = left + "px";
                    appResizing.app.style.width = width + "px";
                    break;
                // case "nw":
                default:
                    cl("Error");
                    break;
            }
        });
    },
    /**
    * Toggles the resizing state of the application window.
    * Sets up or removes the necessary event listeners and updates the application state.
    * @param {boolean} value - A boolean indicating whether to start or stop resizing.
    * @returns {boolean} Returns false if the application element is not found.
    */
    changeEvent: function (value) {
        let app = this.element;
        if (app) {
            this.grip = app.classList[1].split("-grip")[0];
            while (!app?.classList?.contains("windows-app")) {
                if (app === null) {
                    return false;
                } else {
                    app = app.parentElement;
                }
            }
            this.app = app;
        }
        if (value) {
            // cl("true: ", this.app, " this.grip: ", this.grip);
            this.boundingBox = this.app.getBoundingClientRect();
            deselectAllApps();
            this.app.classList.add("active");
            navbar.querySelector('[data-uuid="' + this.app.dataset.uuid + '"]').classList.add("active");
            this.app.classList.add("resizing");
            this.app.style.zIndex = getLowestMaxAppZIndex();
            window.addEventListener("mousemove", this.resizingEvent);
        } else {
            // cl("false: ", this.app);
            if (this.app) {
                this.app.classList.remove("resizing");
            }
            window.removeEventListener("mousemove", this.resizingEvent);
        }
    },
    get status() {
        return this._status;
    },
    set status(parameters) {
        let newValue = parameters[0];
        let localThis = parameters[1];
        this._status = newValue;
        if (localThis && localThis.classList.contains("resizable")) {
            this.element = localThis;
        }
        this.changeEvent(newValue);
    }
};

/**
 * The function `updateCalendar` handles calendar generation
 */
function updateCalendar() {
    let dayOne = new Date(year, month, 0).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let monthLastDate = new Date(year, month, 0).getDate();
    let lit = "";

    for (let i = dayOne; i > 0; i--) {
        lit +=
            `<li class="inactive" tabindex="-1">${monthLastDate - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let isToday = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}" tabindex="-1">${i}</li>`;
    }

    for (let i = 0; i < 42 - dayOne - lastDate; i++) {
        lit += `<li class="inactive" tabindex="-1">${i + 1}</li>`
    }

    document.querySelector(".calendar-current-date").textContent = months[month] + " " + year;
    document.querySelector(".calendar-dates").innerHTML = lit;
}

/**
 * The function `getLowestMaxAppZIndex` get lowest unused z-index for displaying above others
 */
function getLowestMaxAppZIndex() {
    let indexes = [];
    const elements = windows.querySelectorAll(".windows-app");
    if (elements.length === 0) {
        return 100;
    }
    elements.forEach((element) => {
        indexes.push(element.style.zIndex ? Number(element.style.zIndex) : 0)
    });
    return indexes.sort((a, b) => b - a)[0] + 1;
}

/**
 * The function `getBluetooth` check if users computer or browser supports browser bluetooth api and if so, it creates navbar bluetooth access and click handler
 */
async function getBluetooth() {
    if (await navigator.bluetooth.getAvailability()) {
        const bluetoothNavbar = createElement("div", new ClassList("bluetooth"));
        const bluetoothIcon = createElement("div", new ClassList("material-symbols-rounded"), new TextContent("bluetooth"), new AppendTo(bluetoothNavbar));
        // TODO: BT event
        bluetoothIcon.addEventListener("click", async (event) => {
            event.stopPropagation();
            try {
                await navigator.bluetooth.requestDevice({ "acceptAllDevices": true });
            } catch (error) {
            }
        });

        document.querySelector(".navbar-bluetooth > .navbar-button-content").appendChild(bluetoothNavbar);
    }
}

/**
 * Retrieves battery information and updates the battery icon and tooltip accordingly.
 */
function getBattery() {
    const icons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
    const iconsCharging = ["battery_charging_full", "battery_charging_20", "battery_charging_30", "battery_charging_80", "battery_charging_90", "battery_full"]
    navigator.getBattery().then((battery) => {
        // cl("Battery: ", battery);

        const batteryNavbar = createElement("div", new ClassList("battery"));
        const batteryIcon = createElement("span", new ClassList("material-symbols-rounded"), new AppendTo(batteryNavbar));
        const batteryTooltip = createElement("div", new ClassList("battery-tooltip"), new AppendTo(batteryNavbar));

        if (!battery.charging || battery.chargingTime !== 0) {
            document.querySelector(".navbar-battery > .navbar-button-content").appendChild(batteryNavbar);
            updateBatteryInfo();
        }

        function updateBatteryInfo() {
            if (battery.charging) {
                batteryTooltip.textContent = "Stav baterie: nabíjení " + (battery.level * 100).toFixed() + "%"
                if (battery.chargingTime > 0 && isFinite(battery.chargingTime)) {
                    batteryTooltip.textContent += " (" + (battery.chargingTime / 3600).toFixed() + "h" + ((battery.chargingTime / 60) % 60).toFixed() + "m)"
                }
                batteryIcon.textContent = iconsCharging[scaleValue(battery.level, [0, 1], [0, 5])];
            } else {
                batteryTooltip.textContent = "Stav baterie: zbývá " + (battery.level * 100).toFixed() + "%"
                if (battery.dischargingTime > 0 && isFinite(battery.dischargingTime)) {
                    batteryTooltip.textContent += " (" + (battery.dischargingTime / 3600).toFixed() + "h" + ((battery.dischargingTime / 60) % 60).toFixed() + "m)"
                }
                batteryIcon.textContent = icons[scaleValue(battery.level, [0, 1], [0, 7])];
            }
        }

        battery.addEventListener("chargingchange", updateBatteryInfo);
        battery.addEventListener("levelchange", updateBatteryInfo);
        battery.addEventListener("chargingtimechange", updateBatteryInfo);
        battery.addEventListener("dischargingtimechange", updateBatteryInfo);
    });
}

/**
 * Handles the upload of files, checking if the file size exceeds the maximum allowed size. And run ajax calls for them separately
 * @param files - The list of files to be uploaded.
 */
function handleFileUpload(files, parentUuid) {
    const maxSize = 50 * (1024 * 1024); // 50 MB

    [...files].forEach(function (file) {
        if (file) {
            if (file.size > maxSize) {
                addNotification({ "head": "Soubor je moc velký (" + sizeNumberToString(file.size) + " > 50MB)", "body": "Soubor: " + file.name }, false, null, "error");
                cl("|📙 File size exceeds the limit of 50 MB");
                return;
            }
            if (!isValidFileType(file)) {
                addNotification({ "head": "Typ souboru není podporovaný", "body": "Soubor: " + file.name }, false, null, "error");
                cl("|📙 File type is not supported", file);
                return;
            }
            cl("|📘 File to be uploaded: ", file);
            const data = { "method": "upload", "parent": parentUuid, "fileUpload": file };
            ajax(data).then(response => {
                if (response.status == "ok") {
                    const newNode = nodeFromAjax(response);
                    addNotification({ "head": "Nahrání", "body": "Ok: " + newNode.uuid }, false, null, "info", true);
                    processVNodes([newNode]);
                    addDesktopIcon(newNode);
                } else {
                    addNotification({ "head": "Nahrání", "body": "Chyba: " + response.details }, false, null, "warning");
                }
            });
        }
    });
}

// TODO: dodělat dokumentaci

async function processExplorerIcons(vNodes) {
    let time1 = new Date();
    // let rootId = await localDatabase.getColumn("vNodes", "type", "root");
    // let desktopNode = await localDatabase.getColumn("vNodes", "parent", rootId[0]?.uuid).then((result) => result.find((node) => node.type === "desktop"));
    // let desktopNodes = await localDatabase.getColumn("vNodes", "parent", desktopNode?.uuid);
    // desktopNodes.forEach((node) => addDesktopIcon(node));

    // cl(getParam("folder"));
    // cl("nodes: ", vNodes);

    vNodes.forEach((node) => addExplorerIcon(node));

    cl("|📗 Explorer processed in " + (new Date() - time1) + "ms");
}

async function explorerOpenApp(event, element = null) {
    event.preventDefault();
    event.stopPropagation();
    if (element) {
        const node = await localDatabase.getColumn("vNodes", "uuid", element.dataset.uuid);
        if (event.ctrlKey || node[0].type == "file" || node[0].type == "link") {
            window.top.postMessage(["appOpen", node[0].uuid]);
        } else {
            location.assign(location.origin + "/~bukovja4/public/explorer.php?folder=" + node[0].uuid)
        }
    }
}

function addExplorerIcon(node) {
    const holder = createElement("div", new ClassList("file"), new Data("uuid", node.uuid), new ElementEvent("dblclick", () => {
        // cl("opening window ", node.uuid);
        // window.top.postMessage(["appOpen", node.uuid]);
        explorerOpenApp(event, holder);
    }));
    const name = createElement("div", new ClassList("name"), new AppendTo(holder));
    const icon = createElement("img", new Src(getIcon(node)), new AppendTo(name));
    const fileName = createElement("span", new ClassList("name"), new TextContent(node.name), new AppendTo(name));
    const change = createElement("span", new ClassList("change"), new TextContent(timestampToHuman(node.timeEdit)), new AppendTo(holder));
    const type = createElement("span", new ClassList("type"), new TextContent(node.description), new AppendTo(holder));
    const size = createElement("span", new ClassList("size"), new TextContent(sizeNumberToString(node.size)), new AppendTo(holder));

    files.appendChild(holder);
}

async function processDesktopIcons() {
    let time1 = new Date();
    let rootId = await localDatabase.getColumn("vNodes", "type", "root");
    let desktopNode = await localDatabase.getColumn("vNodes", "parent", rootId[0]?.uuid).then((result) => result.find((node) => node.type === "desktop"));
    let desktopNodes = await localDatabase.getColumn("vNodes", "parent", desktopNode?.uuid);
    desktopNodes.forEach((node) => addDesktopIcon(node));

    cl("|📗 Desktop processed in " + (new Date() - time1) + "ms");
}

function addDesktopIcon(node) {
    const holder = createElement("figure", new ClassList("icon"));
    const icon = createElement("img", new Src(getIcon(node)), new Alt("desktop-icon"), new AppendTo(holder));
    const caption = createElement("figcaption", new Data("uuid", node.uuid), new AppendTo(holder));
    const textarea = createElement("textarea", new Name("icon-name"), new Cols(11), new ReadOnly(true), new TextContent(node.name), new AppendTo(caption));
    desktop.appendChild(holder);

    desktopIconTooltip(holder, node);
    desktopIconSelect(holder);
    desktopIconOpener(holder);
    desktopIconContextMenu(holder, node);
    desktopIconEditName(caption);
}

/**
 * Check if the file type is valid based on a list of allowed file types.
 * @param file - The file to check its type.
 * @returns - `True` if the file type is valid, `false` otherwise.
 */
function isValidFileType(file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain"]
    return allowedTypes.includes(file.type)
}

/**
 * Updates the slider element with a linear gradient background based on the current value. CSS/JS trick
 * @param rangeElement - The range input element to update.
 * @returns The percentage value of the slider.
 */
function updateSlider(rangeElement) {
    const percentage = (rangeElement.value - Number(rangeElement.min)) / (Number(rangeElement.max) - Number(rangeElement.min)) * 100;
    rangeElement.style = "background: linear-gradient(to right, rgb(64, 189, 255), rgb(64, 189, 255) " + percentage + "%, rgb(148, 166, 191) " + percentage + "%, rgb(148, 166, 191) 100%)";
    return percentage;
}

/**
 * Check if two elements on the page collide with each other.
 * @param el1 - The first element to check for collision.
 * @param el2 - The second element to check for collision.
 * @returns `True` if the elements collide, `false` otherwise.
 */
function elementsCollide(el1, el2) {
    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    );
}

/**
 * Polyfill for the replaceAll method on the String prototype if it does not already exist.
 * + Plus capitalization of the strings
 */
if (!String.prototype.replaceAll) {
    Object.defineProperty(String.prototype, 'replaceAll', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (str, newStr) {
            if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
                return this.replace(str, newStr);
            }
            return this.replace(new RegExp(str, "g"), newStr);
        }
    });
}
if (!String.prototype.capitalize) {
    Object.defineProperty(String.prototype, 'capitalize', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    });
}

/**
 * Adds a notification to the navbar with the specified content and options.
 * @param content - The content of the notification.
 * @param permanent - Whether the notification should be permanent or dismissible.
 * @param nodeOrSystem - The node or system to associate the notification with.
 * @param icon - The icon to display with the notification.
* @returns The created notification element.
*/
function addNotification(content, permanent = false, nodeOrSystem = null, icon = null, debugOnly = false) {
    if ((debugOnly) && !DEBUG) {
        return;
    }
    // TODO: add debugOnly=true on dev calls
    if (pageInIframe()) {
        window.top.postMessage(["notification", content, permanent, nodeOrSystem, icon]);
        return;
    }

    navbar.querySelector(".navbar-notifications #notifications").classList.add("fill");

    const defaultIcons = {
        "info": "./media/ui/info.webp",
        "warning": "./media/ui/warning.webp",
        "error": "./media/ui/error.webp"
    }

    const notification = createElement("div", new ClassList("notification"));
    const notificationHeader = createElement("header", new AppendTo(notification));
    const notificationIcon = createElement("img", new AppendTo(notificationHeader), new Alt("notification-icon"), new Src(nodeOrSystem ? getIcon(nodeOrSystem) : defaultIcons[icon ? icon : "info"]));
    const notificationTitle = createElement("span", new ClassList("title"), new TextContent(nodeOrSystem ? nodeOrSystem.name : "Systém"), new AppendTo(notificationHeader));
    const notificationSpacer = createElement("div", new ClassList("spacer"), new AppendTo(notificationHeader));

    if (!permanent) {
        const notificationClose = createElement("span", new ClassList("material-symbols-rounded", "close"), new TextContent("close"), new AppendTo(notificationHeader));
        notificationClose.addEventListener("click", (event) => {
            if (notification.classList.contains("show-extra")) {
                notification.classList.add("hide-extra");
                if ((navbar.querySelectorAll(".navbar-notifications > .extra-notifications > .notification").length + navbar.querySelectorAll(".navbar-notifications .notifications-content > .notification").length) == 1) {
                    navbar.querySelector(".navbar-notifications #notifications").classList.remove("fill");
                }
            } else {
                notification.classList.add("closing");
            }
            setTimeout(() => {
                notification.remove();
            }, 250);
        });
    }
    const notificationContent = createElement("div", new ClassList("notification-content"), new AppendTo(notification));
    const notificationContentHead = createElement("div", new ClassList("notification-head"), new TextContent(content?.head), new AppendTo(notificationContent));
    const notificationContentBody = createElement("div", new ClassList("notification-body"), new TextContent(content?.body), new AppendTo(notificationContent));

    if (!navbar.querySelector(".notifications-container").classList.contains("open")) {
        notification.classList.add("show-extra");
        navbar.querySelector(".navbar-notifications > .extra-notifications").appendChild(notification);
        if (!permanent) {
            setTimeout(() => {
                if (!notification.classList.contains("hide-extra")) {
                    notification.classList.add("hide-extra");
                    setTimeout(() => {
                        notification.classList.remove("show-extra");
                        notification.classList.remove("hide-extra");
                        navbar.querySelector(".navbar-notifications .notifications-content").append(notification);
                    }, 250);
                }
            }, 6000);
        }
    } else {
        navbar.querySelector(".navbar-notifications .notifications-content").append(notification);
    }
    return notification
}

/**
 * Displays a timeout notification that counts down from 60 seconds and redirects the user
* to a session timeout page when the countdown reaches 0.
*/
async function timeoutNotification() {
    const notification = await addNotification({ "head": "Relace vypršela | Přihlaš se prosím znovu" }, true, null, "error");
    let i = 60;
    notification.querySelector(".notification-body").textContent = "Automatické odhlášení za: " + i + "s";
    setInterval(() => {
        i--;
        notification.querySelector(".notification-body").textContent = "Automatické odhlášení za: " + i + "s";
        if (i <= 0) {
            window.location.assign("index.php?event=session-timeout");
        }
    }, 1000);
}

/**
 * Performs an AJAX request to the server using the provided data.
 * @param data - The data to be sent in the request.
 * @param url - API endpoint address
 * @returns  A promise that resolves to the response content in JSON format.
 */
async function ajax(data, url = "ajax.php") {
    let formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    });
    const content = await rawResponse.json();

    cl("|📙 Received: ", content);
    return content;
}

/**
 * Creates a new vNode object from the JSON response obtained from an AJAX call.
 * @param response - The JSON response object from the AJAX call.
 * @returns A new vNode object created from the parsed JSON response.
 */
function nodeFromAjax(response) {
    let parsed = JSON.parse(response.item[0]);

    const result = new vNode(parsed.uuid, parsed.type, parsed.parent, parsed.timeCreate, parsed.timeEdit, parsed.timeRead, parsed.owner, parsed.permissions, parsed.name, parsed.description, parsed.size, parsed.data, parsed.icon);
    return result;
}

/**
 * Asynchronously processes an array of virtual nodes by adding each node to the local database.
 * @param vNodes - An array of virtual nodes to be processed.
 */
async function processVNodes(vNodes) {
    let time1 = new Date();
    vNodes.forEach(async (node) => {
        await localDatabase.add("vNodes", node);
    })
    cl("|📗 vNodes processed in " + (new Date() - time1) + "ms");
}

/**
 * Debounces a callback function to limit the rate at which it is executed.
 * @param callback - The function to be debounced.
 * @param delay - The delay in milliseconds before the function is executed.
 * @returns A debounced version of the original callback function.
 */
function debounce(callback, delay) {
    let timerId;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timerId);
        timerId = setTimeout(function () {
            callback.apply(context, args);
        }, delay);
    };
}


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
            let data;
            if (getParam("folder")) {
                data = { "method": "create", "type": "file", "parent": getParam("folder") };
            } else {
                data = { "method": "create", "type": "file", "parent": desktopNode[0].uuid };
            }
            cl("|📗 Sending data:", data);
            ajax(data).then(response => {
                if (response.status == "ok") {
                    const newNode = nodeFromAjax(response);
                    addNotification({ "head": "Vytvoření", "body": "Ok: " + newNode.uuid }, false, null, "info", true);
                    processVNodes([newNode]);
                    if (!location.href.includes("explorer")) {
                        addDesktopIcon(newNode);
                    } else {
                        addExplorerIcon(newNode);
                    }
                } else {
                    addNotification({ "head": "Vytvoření", "body": "Chyba: " + response.details }, false, null, "warning");
                }
            }).catch(error => {
                addNotification({ "head": "Vytvoření", "body": "Chyba: internal" }, false, null, "warning");
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
            let data;
            if (getParam("folder")) {
                data = { "method": "create", "type": "folder", "parent": getParam("folder") };
            } else {
                data = { "method": "create", "type": "folder", "parent": desktopNode[0].uuid };
            }
            cl("|📗 Sending data:", data);
            ajax(data).then(response => {
                if (response.status == "ok") {
                    const newNode = nodeFromAjax(response);
                    addNotification({ "head": "Vytvoření", "body": "Ok: " + newNode.uuid }, false, null, "info", true);
                    processVNodes([newNode]);
                    if (!location.href.includes("explorer")) {
                        addDesktopIcon(newNode);
                    } else {
                        addExplorerIcon(newNode);
                    }
                } else {
                    addNotification({ "head": "Vytvoření", "body": "Chyba: " + response.details }, false, null, "warning");
                }
            }).catch(error => {
                cl("!!!!!!!!");
                addNotification({ "head": "Vytvoření", "body": "Chyba: internal" }, false, null, "warning");
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
                addNotification({ "head": "Upravení", "body": "Ok: " + response.uuid }, false, null, "info", true);
            } else {
                addNotification({ "head": "Upravení", "body": "Chyba: " + response.details }, false, null, "warning");
            }
        });
    }

    /**
     * Deletes a file based on the event triggered.
     * @param {Event} event - The event that triggered the file deletion.
     * @param {string} uuid - The uuid of the file to be deleted. Optional, but do not need an event
     * @returns None
     */
    static fileDelete = async (event, uuid = null) => {
        if (event) {
            uuid = bubbleToClass(event, "icon").querySelector("[data-uuid]").dataset.uuid;
        }
        const vNode = (await localDatabase.getColumn("vNodes", "uuid", uuid))[0];
        if (vNode.permissions.canDelete && confirm("Opravdu chcete smazat " + vNode.name + "?\nTato akce nelze vzít zpět!")) {
            cl("|📘 Deleting vNode with uuid: ", uuid);
            ajax({ "method": "delete", "fileUuid": uuid }).then(async (response) => {
                if (response.status == "ok") {
                    addNotification({ "head": "Odstanění", "body": "Ok: " + response.uuid }, false, null, "info", true);
                    if (window.location.pathname.split("/").pop().includes("desktop")) {
                        if (desktop.querySelector('.icon:has([data-uuid="' + uuid + '"])')) {
                            desktop.querySelector('.icon:has([data-uuid="' + uuid + '"])').remove();
                        }
                        navbar.querySelector('.search-menu .search-result[data-uuid="' + uuid + '"]');
                        closeSearchbarMenu();
                    } else {
                        files.querySelector('.file[data-uuid="' + 1 + '"]').remove();
                    }
                    let tmpVNodes = (await localDatabase.getColumn("vNodes", "uuid", uuid))[0];
                    async function recursiveDelete(vNode) {
                        cl(vNode);
                        tmpVNodes = await localDatabase.getColumn("vNodes", "parent", vNode.uuid);
                        tmpVNodes.forEach(vNode => {
                            recursiveDelete(vNode);
                        });
                        localDatabase.delete("vNodes", [vNode]);
                        const app = windows.querySelector('.windows-app[data-uuid="' + vNode.uuid + '"]');
                        if (app) {
                            closeApp(app, true)
                        }
                    }
                    cl("|📘 RecursiveDelete:");
                    recursiveDelete(tmpVNodes);
                } else {
                    addNotification({ "head": "Odstanění", "body": "Chyba: " + response.details }, false, null, "warning");
                }
            });
        }
    }

    static NoPropagation(event) {
        event.stopPropagation();
    }
}

function processLoginErrors(url) {
    history.replaceState({}, "", url);
    const authType = url.searchParams.entries().find(item => item[0] == "type")[1];
    const error = url.searchParams.entries().find(item => item[0] == "error")[1];
    cl("Auth type: ", authType, "Error: ", error);
}