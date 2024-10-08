"use strict";

//TODO document.querySelectorAll("[data-id='66285580-f084-43fd-b3aa-308399055455']");

window.addEventListener("DOMContentLoaded", async () => {
    cl("|📘 Document Ready");
    let time1 = new Date();

    cl("|📙 Clearing database")
    await deleteDb();

    cl("|📙 Opening indexedDB")
    openDb();

    while (!localDatabase) {
        await sleep(4);
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

//TODO: vylepšit způsob generace columns

window.addEventListener("contextmenu", (event) => {
    // event.preventDefault();
});

window.addEventListener("click", () => {
    deselectSelectedOrOpen();
})

window.addEventListener("blur", () => {
    if (document.activeElement.tagName === "IFRAME") {
        deselectSelectedOrOpen();
    }
});

navbar.querySelector(".navbar-search").addEventListener("click", (event) => {
    if (navbar.querySelector(".navbar-search").contains(event.target)) {
        navbar.querySelector(".navbar-search > .search-menu").classList.toggle("open");
    }
});

navbar.querySelector(".navbar-time .navbar-button-content").addEventListener("click", (event) => {
    // cl(event.target.classList);
    // if (!event.target.classList[0].contains(".calendar-container")) {
    // }
    navbar.querySelector(".navbar-time .calendar-container").classList.toggle("open");
});

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");

const currentDate = document
    .querySelector(".calendar-current-date");

const calendarNavigation = document.querySelectorAll(".calendar-navigation span");

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

// Function to generate the calendar
const manipulate = () => {

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
    currentDate.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
}

manipulate();

// Attach a click event listener to each icon
calendarNavigation.forEach(icon => {

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

var myConfObj = {
    iframeMouseOver: false
}
window.addEventListener('blur', function () {
    if (myConfObj.iframeMouseOver) {
        console.log('Wow! Iframe Click!');
    }
});



function appOpen(node) {
    cl("opening window", node);

    let holder = document.createElement("div");
    holder.classList.add("windows-app");
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

    let iframe = document.createElement("iframe");
    iframe.src = "user-data/" + node.owner + node.data[0] + node.name;
    content.appendChild(iframe);

    let detector = document.createElement("div");
    detector.classList.add("detect");
    content.appendChild(detector);

    iframe.addEventListener('mouseover', function () {
        myConfObj.iframeMouseOver = true;
    });
    iframe.addEventListener('mouseout', function () {
        myConfObj.iframeMouseOver = false;
    });


    // windows.querySelectorAll(".detect").forEach((el) => {
    //     el.addEventListener("click", (e) => {
    //         console.log(new Date() + event);
    //     }, true);
    // });

    // windows.querySelectorAll("iframe").forEach((el) => {
    //     el.addEventListener("mouseover", (e) => {
    //         cl(e.target);
    //     });
    //     el.addEventListener("mouseout", (e) => {
    //         cl(e.target);
    //     });
    // });

    // window.addEventListener("blur", () => {
    //     setTimeout(() => {
    //         if (document.activeElement.tagName === "IFRAME") {
    //             deselectIcons();
    //             cl(document.event)
    //         }
    //     }, 4);
    // });

    windows.appendChild(holder);

    dragApp(holder);
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


function watchIframeFocus(onFocus, onBlur) {
    let iframeClickedLast;

    function windowBlurred(e) {
        const el = document.activeElement;
        if (el.tagName.toLowerCase() == 'iframe') {
            iframeClickedLast = true;
            cl(e);
        }
    }
    function windowFocussed(e) {
        if (iframeClickedLast) {
            iframeClickedLast = false;
            cl(e);
        }
    }
    window.addEventListener('focus', windowFocussed, true);
    window.addEventListener('blur', windowBlurred, true);
}

// watchIframeFocus((e) => cl("focus: ", e), (e) => cl("blur: ", e));


let start;
function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    if (window.event !== undefined) {
        cl(elapsed, window.event)
    }
    requestAnimationFrame(step);
}

// requestAnimationFrame(step);
windows.addEventListener("mousemove", (e) => {
    setTimeout(() => {
        // cl(new Date());
        // a = e.target;
        // cl(a, e.screenX, e.screenY);
    }, 1);
    // e.target.childNodes[2].addEventListener("mouseover", (e) => cl(e));
});




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

input.addEventListener('change', changeFile);


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