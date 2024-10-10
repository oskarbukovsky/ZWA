"use strict";

//TODO document.querySelectorAll("[data-id='66285580-f084-43fd-b3aa-308399055455']");

window.addEventListener("DOMContentLoaded", async () => {
    cl("|📘 Document Ready");
    let time1 = new Date();

    requestAnimationFrame(clock);

    cl("|📙 Clearing database")
    await deleteDb();

    cl("|📙 Opening indexedDB")
    openDb();

    const dbOpenTimeout = 10;
    let time1Db = new Date();
    while (!localDatabase) {
        await sleep(4);
        if (new Date() - time1Db >= dbOpenTimeout * 1000) {
            openDbError(dbOpenTimeout);
            return;
        }
        scheduler.yield();
    }

    cl("|📙 Processing userIdentifier...");
    await processUserIdentifier();

    cl("|📙 Processing vNodes...");
    await processVNodes();

    cl("|📙 Processing desktop...");
    await processDesktopIcons();

    cl("|📘 Finished in " + (new Date() - time1) + "ms");
    // 📕📙📗📘
    return;
});

let localDatabase
const dbName = "ZWA";
const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("user", Object.keys(new user()), "uuid")];
// const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("vFiles", Object.keys(new vFile()), "uuid")];

//TODO: custom získávání columns např. pro permissions a settings

window.addEventListener("contextmenu", (event) => {
    // event.preventDefault();
});

var myConfObj = {
    iframeMouseOver: false,
    lastIframe: null
}
window.addEventListener('blur', (event) => {
    if (myConfObj.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectDesktopIcon();
        deselectAllApps();
        iframe = event;
        let app = myConfObj.lastIframe;
        while (!app?.classList?.contains("windows-app")) {
            app = app.parentElement;
            if (app === null) {
                return false;
            }
        }
        app.classList.add("active");
        navbar.querySelector('[data-id="' + app.dataset.id + '"]').classList.add("active");
    }
});
var iframe;

window.addEventListener("click", (event) => {
    if (!(bubbleToClass(event, "navbar-menu") || bubbleToClass(event, "main-menu"))) {
        closeMainMenu();
    }
    if (!(bubbleToClass(event, "search-menu") || bubbleToClass(event, "searchbar"))) {
        closeSearchbarMenu();
    }
    if (!(bubbleToClass(event, "calendar-container") || bubbleToClass(event, "datetime"))) {
        closeDesktopCalendar();
    }
    // bubbleToClass(event, "windows-app")?.classList?.remove("active");
    deselectDesktopIcon();
    if (!bubbleToClass(event, "windows-app") && !bubbleToClass(event, "navbar-icon")) {
            deselectAllApps();
    }
})

navbar.querySelector(".navbar-menu").addEventListener("click", (event) => {
    if (event.target != navbar.querySelector(".navbar-menu > .main-menu")) {
        navbar.querySelector(".navbar-menu > .main-menu").classList.toggle("open");
    }
});

navbar.querySelector(".navbar-search .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-search > .search-menu").classList.toggle("open");
});

navbar.querySelector(".navbar-time .navbar-button-content").addEventListener("click", () => {
    navbar.querySelector(".navbar-time > .calendar-container").classList.toggle("open");
});

navbar.querySelector(".navbar-minimize").addEventListener("click", () => {
    cl(".navbar-minimize");
    deselectAllApps();
    windows.querySelectorAll(".windows-app").forEach((app) => {
        app.classList.add("minimized");
    });
});

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();


// Function to generate the calendar
const manipulate = () => {
    // Array of month names
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

    // Get the first day of the month
    let dayOne = new Date(year, month, 0).getDay();

    // Get the last date of the month
    let lastDate = new Date(year, month + 1, 0).getDate();

    // Get the last date of the previous month
    let monthLastDate = new Date(year, month, 0).getDate();

    // Variable to store the generated calendar HTML
    let lit = "";

    // Loop to add the last dates of the previous month
    for (let i = dayOne; i > 0; i--) {
        lit +=
            `<li class="inactive" tabindex="-1">${monthLastDate - i + 1}</li>`;
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastDate; i++) {

        // Check if the current date is today
        let isToday = i === date.getDate()
            && month === new Date().getMonth()
            && year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}" tabindex="-1">${i}</li>`;
    }

    // Loop to add the first dates of the next month
    for (let i = 0; i < 42 - dayOne - lastDate; i++) {
        lit += `<li class="inactive" tabindex="-1">${i + 1}</li>`
    }

    // Update the text of the current date element 
    // with the formatted current month and year
    document.querySelector(".calendar-current-date").textContent = months[month] + " " + year;

    // update the HTML of the dates element 
    // with the generated calendar
    document.querySelector(".calendar-dates").innerHTML = lit;
}

manipulate();
// Attach a click event listener to each icon
document.querySelectorAll(".calendar-navigation span").forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {

        // Check if the icon is "calendar-prev"
        // or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, new Date().getDate());

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        }

        else {

            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to 
        // update the calendar display
        manipulate();
    });
});


async function processUserIdentifier() {
    let time1 = new Date();
    await localDatabase.add("user", userIdentifier);

    Object.keys(userIdentifier.settings).forEach(key => {
        if (key.includes("Css")) {
            switch (key) {
                case "CssNavbarTransparency":
                    cssVar("--navbar-transparency", userIdentifier.settings[key]);
                    break;
                case "CssNavbarHeigh":
                    cssVar("--navbar-height", userIdentifier.settings[key]);
                    break;
                case "CssAppControlsSize":
                    cssVar("--app-controls-size", userIdentifier.settings[key]);
                    break;
                case "CssAppControlsExtra":
                    cssVar("--app-controls-extra", userIdentifier.settings[key]);
                    break;
                default:
                    cl("### Unknown user settings Css: ", key + "-" + userIdentifier.settings[key]);
                    break;
            }
        }
    });

    cl("|📗 userIdentifier processed in " + (new Date() - time1) + "ms");
}

async function processVNodes() {
    let time1 = new Date();
    vNodes.forEach(async (node) => {
        await localDatabase.add("vNodes", node);
    })
    cl("|📗 vNodes processed in " + (new Date() - time1) + "ms");
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

    cl("|📗 Desktop processed in " + (new Date() - time1) + "ms");
}



const resizingElementsPrefixes = ["nw", "ne", "sw", "se", "n", "e", "s", "w"];
function appOpen(node) {
    deselectAllApps();

    cl("opening window", node);

    let holder = document.createElement("div");
    holder.classList.add("windows-app");
    holder.classList.add("active");
    holder.dataset.id = node.id;

    let header = document.createElement("header");
    header.classList.add("app-header");
    holder.appendChild(header);

    let v1 = document.createElement("div");
    v1.classList.add("app-v1");
    header.appendChild(v1);

    let iconHolder = document.createElement("div");
    iconHolder.classList.add("app-icon");
    v1.appendChild(iconHolder);

    let icon = document.createElement("img");
    icon.src = getIcon(node);
    iconHolder.appendChild(icon);

    let title = document.createElement("div");
    title.textContent = node.name;
    v1.appendChild(title);

    let controls = document.createElement("div");
    controls.classList.add("app-controls");
    header.appendChild(controls);

    let minimize = document.createElement("div");
    minimize.classList.add("minimize");
    controls.appendChild(minimize);

    let maximize = document.createElement("div");
    maximize.classList.add("maximize");
    controls.appendChild(maximize);

    let close = document.createElement("div");
    close.classList.add("close");
    controls.appendChild(close);

    let content = document.createElement("div");
    content.classList.add("app-content");
    holder.appendChild(content);

    // let detector = document.createElement("div");
    // detector.classList.add("detect");
    // content.appendChild(detector);

    let iframe = document.createElement("iframe");

    // cl(node.data[0].split(":\/\/").shift());
    if (node.type == "link") {
        switch (node.data[0].split(":\/\/").shift()) {
            case "vLinkTrash":
                iframe.src = "user-data/" + node.owner + node.data[0] + node.name;
                break;
            case "vComputer":
                iframe.src = "explorer.html?folder=user-data/" + node.owner;
                break;
            default:
                iframe.src = "user-data/" + node.owner + node.data[0] + node.name;
        }
    } else {
        iframe.src = "user-data/" + node.owner + node.data[0] + node.name;
    }


    content.appendChild(iframe);

    let navbarHolder = document.createElement("div");
    navbarHolder.classList.add("navbar-icon");
    navbarHolder.dataset.id = node.id;

    let navbarButton = document.createElement("div");
    navbarButton.classList.add("navbar-button-content");
    navbarHolder.appendChild(navbarButton);

    navbarHolder.addEventListener("click", (event) => {
        setTimeout(() => {}, 20);
        if (bubbleToClass(event, "navbar-icon").classList.contains("active")) {
            bubbleToClass(event, "navbar-icon").classList.remove("active");
            windows.querySelector('[data-id="' + node.id + '"]').classList.add("minimized");
            windows.querySelector('[data-id="' + node.id + '"]').classList.remove("active");
        } else {
            bubbleToClass(event, "navbar-icon").classList.add("active");
            windows.querySelector('[data-id="' + node.id + '"]').classList.remove("minimized");
            windows.querySelector('[data-id="' + node.id + '"]').classList.add("active");
        }
    });

    let navbarIcon = document.createElement("img");
    navbarIcon.src = getIcon(node);
    navbarButton.appendChild(navbarIcon);

    appendBefore(navbarHolder, document.querySelector("#navbar > div.navbar-spacer"));

    iframe.addEventListener("load", () => {
        navbarHolder.classList.add("running");
        navbarHolder.classList.add("active");
    });

    iframe.addEventListener('mouseover', (event) => {
        myConfObj.iframeMouseOver = true;
        myConfObj.lastIframe = event.target;
    });
    iframe.addEventListener('mouseout', () => {
        myConfObj.iframeMouseOver = false;
        myConfObj.lastIframe = null;
    });

    //TODO: resizing
    resizingElementsPrefixes.forEach((item) => {
        var grip = document.createElement("div");
        grip.classList.add("resizable");
        grip.classList.add(item + "grip");
        holder.appendChild(grip);
    });

    windows.appendChild(holder);

    resizeWindow(holder);
    selectApp(holder);
    dragApp(holder);
    minimizeApp(minimize);
    maximizeApp(maximize, header);
    closeApp(close);
}

function addDesktopIcon(node) {
    let holder = document.createElement("figure");
    holder.classList.add("icon");

    let icon = document.createElement("img");
    icon.src = getIcon(node);
    holder.appendChild(icon);

    let caption = document.createElement("figcaption");
    caption.dataset.id = node.id;
    holder.appendChild(caption);

    let textarea = document.createElement("textarea");
    textarea.name = "icon-name";
    textarea.cols = 11;
    textarea.readOnly = true;
    textarea.textContent = node.name;
    caption.appendChild(textarea);

    desktop.appendChild(holder);

    desktopIconSelect(holder);
    desktopIconOpen(holder);
    desktopIconContextMenu(holder);
    desktopIconEditName(caption);
}

const fetchAndLoadImage = async (imagePath) => {
    try {
        let response = await fetch(imagePath);
        return await response.blob();
    } catch (error) {
        console.error(error);
    }
};

// let a, b, c;

// (async () => {

//     a = await fetchAndLoadImage("media/favicon.png")

//     b = await a.stream()

//     c = await b.getReader()

// })();


// const reader = new FileReader();
// reader.onload = function(e) {
//     console.log(e.target.result); // Outputs: Hello
// };
// reader.readAsText(blob);

// let window2 = window.open(textFile, 'log.' + new Date() + '.txt');
// window2.onload = e => window.URL.revokeObjectURL(textFile);

// const inputElement = document.querySelector('input[type="file"]');
// inputElement.addEventListener('change', handleFiles, false);

// function handleFiles() {
//     const fileList = this.files; // fileList is a FileList of File objects
//     const file = fileList[0];

//     // Read the file content
//     const reader = new FileReader();
//     reader.onload = function(e) {
//         console.log(e.target.result);
//     };
//     reader.readAsText(file);
// }


var input = document.querySelector('input[type=file]');

function readFile(event) {
    let data = new Blob([event.target.result], JSON.parse('{"type":"' + file.type + '"}'));
    let textFile = window.URL.createObjectURL(data);
    let window2 = window.open(textFile, 'log.' + new Date() + '.txt');
    // window2.onload = e => window.URL.revokeObjectURL(textFile);
}
async function changeFile() {
    let file = input.files[0];
    let reader = new FileReader();
    let data = reader.readAsArrayBuffer(file)
    reader.addEventListener('load', readFile);

    input.value = null;
    cl(await uploadFiles(data));
}

// input.addEventListener('change', changeFile);


async function uploadFiles(data) {
    const url = 'https://zwa.toad.cz/~xklima/vypisform.php';
    const formData = new FormData(data);

    const fetchOptions = {
        method: "post",
        redirect: "follow",
        body: formData
    };

    let response = fetch(url, fetchOptions);
    // window.location.replace("https://zwa.toad.cz/~xklima/vypisform.php")
    return response;
}