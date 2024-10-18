"use strict";

//TODO document.querySelectorAll("[data-id='66285580-f084-43fd-b3aa-308399055455']");

// https://cdn-factory.marketjs.com/en/trixology-classic-responsive-hd/index.html
// https://www.onlinegames.io/games/2022/unity2/masked-special-forces/index.html
// https://www.chess.com/play/computer
// https://frvr.com/play/solitaire/
// https://play.chessbase.com/en/howto/embedfritz
// https://playpager.com/embed/chess/index.html

// TODO: no html css?

// const sheet = new CSSStyleSheet();
// sheet.replaceSync("div { background-color: red !important; }");
// document.adoptedStyleSheets = [sheet];

// sheet.insertRule("* { background-color: blue; }");

// document.adoptedStyleSheets.push(sheet);

window.addEventListener("DOMContentLoaded", async () => {
    cl("|📘 Document Ready");
    let time1 = new Date();

    appResizing.windowResize();

    getBattery();

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

    cl("|📙 Starting up calendar...");
    setupCalendar();

    cl("|📘 Finished in " + (new Date() - time1) + "ms");
    // 📕📙📗📘

    //Temporary FPS/frameTime/ram usage counter

    if (DEBUG) {
        // (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
    }
});


// const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("vFiles", Object.keys(new vFile()), "uuid")];

//TODO: custom získávání columns např. pro permissions a settings

window.addEventListener("contextmenu", (event) => {
    // event.preventDefault();
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

function appOpen(node) {
    deselectAllApps();
    cl("opening window", node);

    if (windows.querySelector('[data-id="' + node.id + '"]')) {
        cl("app is already open", node);
        return;
    }
    const holder = createElement("div", new Data("id", node.id), new ClassList("windows-app", "active"));
    holder.style.zIndex = getLowestMaxAppZIndex();
    const header = createElement("header", new ClassList("app-header"), new AppendTo(holder));
    const v1 = createElement("div", new ClassList("app-v1"), new AppendTo(header));
    const iconHolder = createElement("div", new ClassList("app-icon"), new AppendTo(v1));
    const icon = createElement("img", new Src(getIcon(node)), new AppendTo(iconHolder));
    const title = createElement("div", new TextContent(node.name), new AppendTo(v1));
    const controls = createElement("div", new ClassList("app-controls"), new AppendTo(header));
    const minimize = createElement("div", new ClassList("minimize"), new AppendTo(controls));
    const maximize = createElement("div", new ClassList("maximize"), new AppendTo(controls));
    const close = createElement("div", new ClassList("close"), new AppendTo(controls));
    const content = createElement("div", new ClassList("app-content"), new AppendTo(holder));


    windows.appendChild(holder);

    const navbarHolder = createElement("div", new ClassList("navbar-icon"), new Data("id", node.id), new ElementEvent("click", ElementEvents.navbarIconClick));
    const navbarButton = createElement("div", new ClassList("navbar-button-content"), new AppendTo(navbarHolder));
    const navbarIcon = createElement("img", new Src(getIcon(node)), new AppendTo(navbarButton));
    appendBefore(navbarHolder, document.querySelector("#navbar > div.navbar-spacer"));

    const appIframeLoaded = () => {
        cl("loaded");
        navbarHolder.classList.add("running");
        navbarHolder.classList.add("active");
    };
    const iframe = createElement("iframe", new Src(getDestination(node)),
        new ElementEvent("load", appIframeLoaded), new ElementEvent("mouseover", ElementEvents.appIframeMouseOver), new ElementEvent("mouseout", ElementEvents.appIframeMouseOut),
        new AppendTo(content));

    // iframe.contentWindow.postMessage('hello', '*');

    // let detector = document.createElement("div");
    // detector.classList.add("detect");
    // content.appendChild(detector);

    //TODO: resizing

    resizingElementsPrefixes.forEach((item) => {
        const grip = createElement("div", new ClassList("resizable", item + "-grip"), new AppendTo(holder));
        grip.addEventListener("mousedown", appResizeDown);
        window.addEventListener("mouseup", appResizeUp);
    });

    resizeWindow(holder);
    selectApp(node.id);
    dragApp(holder);
    minimizeApp(minimize);
    maximizeApp(maximize, header);
    closeApp(close);
    iframe.contentWindow.postMessage("Tu máš Áj Frejme", "*");
}

function addDesktopIcon(node) {
    const holder = createElement("figure", new ClassList("icon"));
    const icon = createElement("img", new Src(getIcon(node)), new AppendTo(holder));
    const caption = createElement("figcaption", new Data("id", node.id), new AppendTo(holder));
    const textarea = createElement("textarea", new Name("icon-name"), new Cols(11), new ReadOnly(true), new TextContent(node.name), new AppendTo(caption));
    desktop.appendChild(holder);

    desktopIconSelect(holder);
    desktopIconOpen(holder);
    desktopIconContextMenu(holder);
    desktopIconEditName(caption);
}

async function fetchAndLoadImage(imagePath) {
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