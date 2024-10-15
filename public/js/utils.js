"use strict";

function getDirectory() {
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
        document.documentElement.style.setProperty(variableName, value.toString());
    } else {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName);
    }
}

function deselectDesktopIcon() {
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
        const selRange = field.createTextRange();
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

// setInterval(function () {
//     var dt = new Date();
//     document.getElementById("datetime").innerHTML = (("0" + dt.getHours()).slice(-2)) + ":" +
//         (("0" + dt.getMinutes()).slice(-2)) + ":" + (("0" + dt.getSeconds()).slice(-2)) + "<br>" + (("0" + dt.getDate()).slice(-2)) + "." + (("0" +
//             (dt.getMonth() + 1)).slice(-2)) + "." + (dt.getFullYear());
// }, 999);

function clock() {
    let dateTime = new Intl.DateTimeFormat("cs-CZ", {
        dateStyle: "short",
        timeStyle: "medium",
        hour12: false
    }).format(new Date()).split(" ");
    // dateTime[0].replace(dateTime[0].split(".").pop(), "20" + dateTime[0].split(".").pop())
    // cl(dateTime[0].replace(dateTime[0].split(".").pop(), "20" + dateTime[0].split(".").pop()));
    document.getElementById("datetime").setAttribute("data-date", dateTime[0].replace(dateTime[0].split(".").pop(), "20" + dateTime[0].split(".").pop()));
    document.getElementById("datetime").setAttribute("data-time", dateTime[1] + " ");
    requestAnimationFrame(clock);
}

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
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = success();
    });
}

function openDbError(timeout) {
    cl("! Nedaří se připojit k databázi v časovém limitu: " + timeout + "s");
    cssVar("--db-error", '"Nedaří se připojit k databázi v časovém limitu ' + timeout + 's: \\a Zavřete ostatní okna s aplikací"');
    const errorsElement = document.querySelector(".errors");
    errorsElement.classList.remove("hidden")
    errorsElement.document.querySelector(".errors").classList.add("db-error");
}

function openDb() {
    let time1 = new Date();
    let localDatabaseRequest = indexedDB.open(dbName, 1);
    const errorsElement = document.querySelector(".errors");

    localDatabaseRequest.onsuccess = function (event) {
        // cl("DB Success: ", event);
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
            cl("! Spojení s databází bylo přerušeno: ", event);
            cssVar("--db-error", '"Spojení s lokální databází bylo přerušeno"');

            errorsElement.classList.remove("hidden")
            errorsElement.classList.add("db-error");
        }
        localDatabase.onerror = function (event) {
            cl("Nastala chyba v databázi: ", event);
            cssVar("--db-error", '"Nastala chyba v databázi: \\a ' + event.target.error + '"');

            errorsElement.classList.remove("hidden")
            errorsElement.classList.add("db-error");

        };
        cl("|📗 indexedDB Ready in " + (new Date() - time1) + "ms");
    };

    localDatabaseRequest.onerror = function (event) {
        cl("Prohlížeč pravděpodobně nepodporuje nebo je zakázaná IndexedDB: ", event);
        cssVar("--db-error", '"Prohlížeč pravděpodobně nepodporuje nebo je zakázaná IndexedDB"');

        errorsElement.classList.remove("hidden")
        errorsElement.classList.add("db-error");
    };

    localDatabaseRequest.onblocked = function (event) {
        cl("! Nelze navázat spojení s databází: ", event);
        cssVar("--db-error", '"Nelze navázat spojení s databází"');

        errorsElement.classList.remove("hidden")
        errorsElement.classList.add("db-error");
    };

    localDatabaseRequest.onupgradeneeded = function (event) {
        // cl("DB Upgrade: ", event);
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

function getDestination(node) {
    if (node.type == "link") {
        switch (node.data[0].split(":\/\/").shift()) {
            case "vLinkTrash":
                return "user-data/" + node.owner + node.data[0] + node.name;
            case "vComputer":
                return "explorer.html?folder=user-data/" + node.owner;
            default:
                return "user-data/" + node.owner + node.data[0] + node.name;
        }
    } else {
        return "user-data/" + node.owner + node.data[0] + node.name;
    }
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
                        case "vComputer":
                            return "./media/file-icons/computer.webp";
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

function bubbleToClass(event, className) {
    event.preventDefault();
    let app = event.target;
    while (!app?.classList?.contains(className)) {
        app = app.parentElement;
        if (app === null) {
            return false;
        }
    }
    return app;
}

function minimizeApp(minimizeButton) {
    minimizeButton.addEventListener("click", (event) => {
        let app = bubbleToClass(event, "windows-app");
        app.classList.toggle("minimized");

        deselectAllApps();
    });
}

function maximizeApp(maximizeButton, header) {
    maximizeButton.addEventListener("click", (event) => {
        bubbleToClass(event, "windows-app").classList.toggle("maximized");
    });
    header.addEventListener("dblclick", (event) => {
        bubbleToClass(event, "windows-app").classList.toggle("maximized");
    });
}

function closeApp(closeButton) {
    closeButton.addEventListener("click", (event) => {
        let app = bubbleToClass(event, "windows-app");
        app.classList.add("closing");
        setTimeout(() => {
            app.remove();
        }, 250);
        const navbarIcon = navbar.querySelector('[data-id="' + app.dataset.id + '"]');
        if (navbarIcon.dataset.persistent != "false") {
            navbarIcon.classList.add("closing");
            setTimeout(() => {
                navbarIcon.remove();
            }, 250);
        }
    });
}

function dragApp(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.querySelector(".app-header").onmousedown = dragMouseDown;

    function dragMouseDown(event) {
        let app = bubbleToClass(event, "windows-app");
        if (!app.classList.contains("maximized")) {
            doDrag(app);
        } else {
            //TODO: need some extra work, do later

            // app.classList.remove("maximized");
            // doDrag(app);
            // app.classList.add("dragging");
            // pos3 = event.clientX;
            // pos4 = event.clientY;
            // document.onmouseup = closeDragElement;
            // document.onmousemove = elementDrag;
        }
    }

    function doDrag(app) {
        app.classList.add("dragging");
        deselectAllApps();
        // cl("selecting: ", app.dataset.id);
        selectApp(app.dataset.id);
        app.style.zIndex = getLowestMaxAppZIndex();
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
        let app = bubbleToClass(event, "windows-app");
        if (app) {
            app.classList.remove("dragging");

            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

function desktopIconSelect(element) {
    element.addEventListener("click", (event) => {
        if (!is_key_down('Control')) {
            deselectDesktopIcon();
        }
        element.classList.toggle("icon-selected");
        closeDesktopCalendar();
        event.stopPropagation();
    })
}

function selectApp(id) {
    deselectAllApps(id); 
    windows.querySelector('[data-id="' + id + '"]').classList.add("active");
    navbar.querySelector('[data-id="' + id + '"]').classList.add("active");
}

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
            case ElementEvent:
                element.addEventListener(parameter.type, parameter.handler);
                break;
            case AppendTo:
                parameter.element.appendChild(element);
                break;
            default:
                cl("Element construction error: " + parameter);
                break;
        }
    }
    return element;
}

function deselectAllApps() {
    windows.querySelectorAll(".windows-app").forEach((app) => {
        app.classList.remove("active");
    });
    navbar.querySelectorAll("div.active").forEach((element) => {
        // cl("unActivating: ", element);
        element.classList.remove("active")
    });
}

function closeDesktopCalendar() {
    navbar.querySelector(".calendar-container").classList.remove("open");
}

function closeSearchbarMenu() {
    navbar.querySelector(".search-menu").classList.remove("open");
}

function closeMainMenu() {
    navbar.querySelector(".main-menu").classList.remove("open");
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


function resizeWindow(app) {
    // cl("Preparing resizing: ", app);
    resizingElementsPrefixes.forEach((side) => {
        let resizingElement = app.querySelector("." + side + "grip");
        // cl("side: " + side + ", Selector: \"" + "." + side + "grip" + "\"\n", resizingElement);
    })
}

function appendBefore(element, beforeWhat) {
    return beforeWhat.parentNode.insertBefore(element, beforeWhat);;
}

function manipulateCalendar() {
    const months = [
        "leden",
        "únor",
        "březen",
        "duben",
        "květen",
        "červen",
        "červenec",
        "srpen",
        "září",
        "říjen",
        "listopad",
        "prosinec"
    ];
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
function setupCalendar() {

    // Function to generate the calendar

    manipulateCalendar();
}

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

        battery.addEventListener("chargingchange", () => {
            updateBatteryInfo();
        });
        battery.addEventListener("levelchange", () => {
            updateBatteryInfo();
        });
        battery.addEventListener("chargingtimechange", () => {
            updateBatteryInfo();
        });
        battery.addEventListener("dischargingtimechange", () => {
            updateBatteryInfo();
        });

        function updateBatteryInfo() {
            if (battery.charging) {
                batteryTooltip.textContent = "Stav baterie: nabíjení " + (battery.level * 100).toFixed() + "%"
                if (battery.chargingTime > 0 && isFinite(battery.chargingTime)) {
                    batteryTooltip.textContent += " (" + (battery.chargingTime / 3600).toFixed() + "h" + ((battery.chargingTime / 60) % 60).toFixed() + "m)"
                }
                batteryIcon.textContent = iconsCharging[scaleValue(battery.level, [0, 1], [0, 5])];
            } else {
                batteryTooltip.textContent = "Stav baterie: zbývá " + (battery.level * 100).toFixed() + "%"
                if(battery.dischargingTime > 0 && isFinite(battery.dischargingTime)) {
                    batteryTooltip.textContent += " (" + (battery.dischargingTime / 3600).toFixed() + "h" + ((battery.dischargingTime / 60) % 60).toFixed() + "m)"
                }
                batteryIcon.textContent = icons[scaleValue(battery.level, [0, 1], [0, 7])];
            }
        }
    });

}

function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
}

function handleFileUpload(files) {
    const maxSize = 2 * 1024 * 1024; // 50 MB

    [...files].forEach(function (file) {
        if (file) {
            if (file.size > maxSize) {
                cl("File size exceeds the limit of 2 MB");
                return;
            } else if (!isValidFileType(file)) {
                cl("File type is not supported");
                return;
            }
            cl("File to be uploaded: ", file);
        }
    });
}

function isValidFileType(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    return allowedTypes.includes(file.type)
}