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
    requestAnimationFrame(clockTooltip);
}

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
                try {
                    dbStore.add(item);
                } catch (error) {
                    cl("📕 ERROR: ", error, item);
                }
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

function getTimeForTooltip(datetime) {
    const date = new Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(datetime).replaceAll(" ", "")
    const time = new Intl.DateTimeFormat("cs-CZ", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    }).format(datetime);
    return date + " " + time;

}

function getIconTooltipText(node) {
    switch (node.type) {
        case "folder":
        case "images":
        case "documents":
            return node.name + "\r\nDatum vytvoření: " + getTimeForTooltip(node.timeCreate) + "\r\nVelikost: " + sizeNumberToString(node.size);
        case "file":
            return node.name + "\r\n" + node.description + "\r\nVelikost: " + sizeNumberToString(node.size) + "\r\nDatum změny: " + getTimeForTooltip(node.timeEdit);
        case "link":
            return "Odkaz na: " + node.data.data[0];
        default:
            return "Soubor";
    }
}

function getDestination(node) {
    if (node.type == "link") {
        switch (node.data.data[0].split(":\/\/").shift()) {
            case "vLinkTrash":
                return "user-data/" + node.owner + node.data.data[0] + node.name;
            case "admin":
                return "administration.html";
            case "vComputer":
                return "explorer.html?folder=user-data/" + node.owner;
            default:
                return "user-data/" + node.owner + node.data.data[0] + node.name;
        }
    } else {
        return "user-data/" + node.owner + node.data.data[0] + node.name;
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
                if (node.data.data[0]) {
                    switch (node.data.data[0].split(":\/\/").shift()) {
                        case "vLinkTrash":
                            return "./media/file-icons/trash.webp";
                        case "vComputer":
                            return "./media/file-icons/computer.webp";
                        case "admin":
                            return "./media/file-icons/admin.webp";
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
    while (app && app.classList && !app?.classList?.contains(className)) {
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

function closeApp(target, forced = false) {
    function close(event) {
        let app = bubbleToClass(event, "windows-app");
        app.classList.add("closing");
        setTimeout(() => {
            app.remove();
        }, 250);
        const navbarIcon = navbar.querySelector('[data-uuid="' + app.dataset.uuid + '"]');
        if (navbarIcon.dataset.persistent != "false") {
            navbarIcon.classList.add("closing");
            setTimeout(() => {
                navbarIcon.remove();
            }, 250);
        }
    }
    if (forced === true) {
        close(target);
        return;
    }
    target.onclick = close;
}

function dragApp(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.querySelector(".app-header").onmousedown = dragMouseDown;

    function dragMouseDown(event) {
        let app = bubbleToClass(event, "windows-app");
        if (!app.classList.contains("maximized")) {
            doDrag(app);
        } else {
            const sizes = element.querySelector(".app-header").getBoundingClientRect();
            const max = element.style.width ? Number(element.style.width.replace("px", "")) : 400 - 5;
            let scaled = scaleValue(event.clientX, [0, sizes.width], [0, element.style.width ? Number(element.style.width.replace("px", "")) : 400]);
            if (scaled < 5) {
                scaled = 5;
            } else if (scaled > max - 5) {
                scaled = max - 5;
            }
            document.onmouseup = closeDragElement;
            document.onmousemove = (event) => {
                element.style.left = (event.clientX - scaled) + "px";
                element.style.top = (event.clientY - (sizes.height / 2)) + "px";
                app.classList.remove("maximized");
                doDrag(app);
                elementDrag(event);
            };
        }
    }

    function doDrag(app) {
        app.classList.add("dragging");
        deselectAllApps();
        selectApp(app.dataset.uuid);
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

function selectApp(uuid) {
    cl(uuid)
    deselectAllApps();
    windows.querySelector('[data-uuid="' + uuid + '"]').classList.add("active");
    navbar.querySelector('[data-uuid="' + uuid + '"]').classList.add("active");
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

function closeAllDesktopContextMenus() {
    desktop.querySelectorAll(".context-menu").forEach((element) => {
        element.classList.remove("open");
        setTimeout(() => element.remove(), 250);
    });
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

function closeScreenMenu() {
    navbar.querySelector(".screen-menu").classList.remove("open");
}

function desktopIconTooltip(element, node) {
    let tooltipTimer, tooltipX, tooltipY;
    element.addEventListener("mouseenter", desktopIconTooltipLogic);
    element.addEventListener("mouseleave", desktopIconTooltipLogic);
    element.addEventListener("mousemove", desktopIconTooltipLogic);
    function desktopIconTooltipLogic(event) {
        if (event.type == "mouseenter") {
            tooltipTimer = new Date();
            const tooltip = createElement("div", new ClassList("icon-tooltip", "no-select"), new AppendTo(element), new TextContent(getIconTooltipText(node)));
            setTimeout(() => {
                if (tooltip && desktop.querySelectorAll(".context-menu").length == 0 && element.querySelectorAll("textarea:not(:read-only)").length == 0) {
                    tooltip.style.left = tooltipX + "px";
                    tooltip.style.top = "calc(1.5rem + " + tooltipY + "px)";
                    tooltip.classList.add("active");
                }
            }, 900);
        } else if (event.type === "mousemove") {
            if (new Date() - tooltipTimer <= 900) {
                tooltipX = event.clientX;
                tooltipY = event.clientY;
            }
        }
        else if (event.type == "mouseleave") {
            const tooltip = element.querySelector(".icon-tooltip");
            if (tooltip && tooltip.classList.contains("active")) {
                tooltip.classList.remove("active");
                setTimeout(() => tooltip.remove(), 250);
            } else {
                if (tooltip) {
                    tooltip.remove();
                } else {
                    cl("unable to remove icon tooltip");
                }
            }
        }
    }
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
                if (battery.dischargingTime > 0 && isFinite(battery.dischargingTime)) {
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

const is_key_down = (() => {
    const state = {};
    window.addEventListener('keyup', (event) => {
        state[event.key] = false;
        // cl(event.key + " " + state[event.key]);
    });
    window.addEventListener('keydown', (event) => {
        state[event.key] = true;
        // cl(event.key + " " + state[event.key]);
    });
    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

function sizeNumberToString(size) {
    let prefix = 0;
    let stage = Object.values(sizePrefixes)[1];
    while (size / stage >= 1) {
        size /= stage;
        prefix++;
    }
    // cl(size, prefix);
    return "" + parseFloat(size.toFixed(2)) + " " + Object.keys(sizePrefixes)[prefix];
};


// class Slider {
//     constructor (rangeElement, options) {
//       this.rangeElement = rangeElement
//       // this.valueElement = valueElement
//       this.options = options

//       // Attach a listener to "change" event
//       this.rangeElement.addEventListener('change', this.updateSlider.bind(this))
//     }

//     // Initialize the slider
//     init() {
//       this.rangeElement.setAttribute('min', options.min)
//       this.rangeElement.setAttribute('max', options.max)
//       this.rangeElement.value = options.cur

//       this.updateSlider()
//     }

//     // Format the money
//     asMoney(value) {
//       return '$' + parseFloat(value)
//         .toLocaleString('en-US', { maximumFractionDigits: 2 })
//     }

//     generateBackground(rangeElement) {   
//       if (this.rangeElement.value === this.options.min) {
//         return
//       }

//       let percentage =  (this.rangeElement.value - this.options.min) / (this.options.max - this.options.min) * 100
//       return 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)'
//     }

//     updateSlider (newValue) {
//         cl("update")
//       // this.valueElement.innerHTML = this.asMoney(this.rangeElement.value)
//       this.rangeElement.style = this.generateBackground(this.rangeElement.value)
//     }
//   }

//   document.addEventListener("load", () => {
//   let rangeElement = navbar.querySelector(".screen-menu > .slider-brightness > input")
//   let valueElement = document.querySelector('.range .range__value span') 

//   let options = {
//     min: 2000,
//     max: 75000,
//     cur: 37500
//   }

//   if (rangeElement) {
//     let slider = new Slider(rangeElement, options)

//     slider.init()
//   }

// });





// class Slider {
//     constructor(rangeElement, options) {
//         this.rangeElement = rangeElement
//         // this.valueElement = valueElement
//         this.options = options

//         // Attach a listener to "change" event
//         this.rangeElement.addEventListener('input', this.updateSlider.bind(this))
//     }

//     init() {
//         this.updateSlider()
//     }

//     generateBackground(rangeElement) {
//         if (rangeElement.value === this.options.min) {
//             return;
//         }

//         let percentage = (rangeElement.value - Number(rangeElement.min)) / (Number(rangeElement.max) - Number(rangeElement.min)) * 100;
//         return 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)';
//     }

//     updateSlider(newValue) {
//         // this.valueElement.innerHTML = this.asMoney(this.rangeElement.value)
//         this.rangeElement.style = this.generateBackground(this.rangeElement.value)
//     }
// }

// function updateSlider(rangeElement) {
//     if (rangeElement.value === this.options.min) {
//         return;
//     }
//     let percentage = (rangeElement.value - Number(rangeElement.min)) / (Number(rangeElement.max) - Number(rangeElement.min)) * 100;
//     rangeElement.style = 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)';
// }

// document.addEventListener("load", () => {

//     let rangeElement = navbar.querySelector(".screen-menu > .slider-brightness > input")

//     rangeElement.addEventListener("change", (event) => {
//         cl(event)
//         if (rangeElement.value === this.options.min) {
//             return;
//         }
//         let percentage = (rangeElement.value - Number(rangeElement.min)) / (Number(rangeElement.max) - Number(rangeElement.min)) * 100;
//         rangeElement.style = 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)';
//     })

// });

function updateSlider(rangeElement) {
    const percentage = (rangeElement.value - Number(rangeElement.min)) / (Number(rangeElement.max) - Number(rangeElement.min)) * 100;
    rangeElement.style = 'background: linear-gradient(to right, rgb(64, 189, 255), rgb(64, 189, 255) ' + percentage + '%, rgb(148, 166, 191) ' + percentage + '%, rgb(148, 166, 191) 100%)';
    return percentage;
}