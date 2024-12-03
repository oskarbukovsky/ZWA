"use strict";

//TODO document.querySelectorAll("[data-uuid='66285580-f084-43fd-b3aa-308399055455']");

// https://cdn-factory.marketjs.com/en/trixology-classic-responsive-hd/index.html
// https://www.onlinegames.io/games/2022/unity2/masked-special-forces/index.html
// https://www.chess.com/play/computer
// https://frvr.com/play/solitaire/
// https://play.chessbase.com/en/howto/embedfritz
// https://playpager.com/embed/chess/index.html

// No CORS extension
// https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino

// TODO: no html css?

// const sheet = new CSSStyleSheet();
// sheet.replaceSync("div { background-color: red !important; }");
// document.adoptedStyleSheets = [sheet];

// sheet.insertRule("* { background-color: blue; }");

// document.adoptedStyleSheets.push(sheet);

// https://ash-speed.hetzner.com/1GB.bin

window.addEventListener("DOMContentLoaded", async () => {
    await navigator.gpu.requestAdapter().then((gpu) => {
        cl("|📗OS : " + (navigator.platform.includes("MacIntel") ? ("MacIntel") : (navigator.platform.includes("Win32") ? ((navigator.userAgent.includes("Win64") ? ("Win64") : ("Win32"))) : (navigator.platform))));
        cl("|📗CPU: " + (navigator.hardwareConcurrency >= 8 ? "8/8+" : navigator.hardwareConcurrency) + " cores");
        cl("|📗GPU: " + gpu.info.vendor.capitalize() + " " + gpu.info.architecture.capitalize());
        cl("|📗RAM: " + (navigator.deviceMemory >= 8 ? "8/8+" : navigator.deviceMemory) + " GB");
        cl("|📗NET: " + (navigator.connection.downlink >= 10 ? "10+Mb/s" : navigator.connection.downlink + "Mb/s"));
    })

    cl("|📘 Document Ready");
    let time1 = new Date();

    appResizing.windowResize();

    await getBluetooth();
    getBattery();
    mouseSelectBox();

    updateCalendar();
    setupClock();

    cl("|📙 Clearing database")
    await deleteDb();

    cl("|📙 Opening indexedDB")
    openDb();

    const dbOpenTimeout = 3;
    let time1Db = new Date();
    while (!localDatabase) {
        await sleep(4);
        if (new Date() - time1Db >= dbOpenTimeout * 1000) {
            openDbError(dbOpenTimeout);
            return;
        }
        // Tricky thing to force newest browsers ! :D Maybe not the best idea for testing 
        // scheduler.yield();
    }

    cl("|📙 Processing userIdentifier...");
    await processUserIdentifier();

    cl("|📙 Processing vNodes...");
    await processVNodes(vNodes);

    cl("|📙 Processing desktop...");
    await processDesktopIcons();

    cl("|📘 JS Finished in " + (new Date() - time1) + "ms");
    cl("|📘 Finish from navigation start " + (new Date() - performance.timing.navigationStart) + "ms");
    // 📕📙📗📘

    timeoutCheck(DEBUG ? 300 : 15);
    
    //Temporary FPS/frameTime/ram usage counter
    if (DEBUG) {
        // (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
    }
});


// const dbStores = [new dbShape("vNodes", Object.keys(new vNode()), "id"), new dbShape("vFiles", Object.keys(new vFile()), "uuid")];

//TODO: custom získávání columns např. pro permissions a settings

// if (!DEBUG) {
    window.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
// }

async function processUserIdentifier() {
    let time1 = new Date();
    await localDatabase.add("user", userIdentifier);

    navbar.querySelector(".user-avatar > img").src = htmlSpecialCharsDecode(userIdentifier.icon);
    navbar.querySelector(".user > span").textContent = userIdentifier.username;

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

async function appOpen(node) {
    const status = await fileRead(node.uuid);
    if (!status) {
        return;
    }
    deselectAllApps();
    cl("opening window", node);

    if (windows.querySelector('[data-uuid="' + node.uuid + '"]')) {
        cl("app is already open", node);
        return;
    }
    const holder = createElement("div", new Data("uuid", node.uuid), new ClassList("windows-app"));
    holder.style.zIndex = getLowestMaxAppZIndex();
    const lastActiveElement = [...windows.querySelectorAll(".windows-app:not(.minimized)")].slice(-1);
    if (lastActiveElement.length > 0) {
        holder.style.top = lastActiveElement[0].offsetTop + 15 + "px";
        holder.style.left = lastActiveElement[0].offsetLeft + 20 + "px";
    }
    const header = createElement("header", new ClassList("app-header"), new AppendTo(holder));
    const v1 = createElement("div", new ClassList("app-v1"), new AppendTo(header));
    const iconHolder = createElement("div", new ClassList("app-icon"), new AppendTo(v1));
    const icon = createElement("img", new Src(getIcon(node)), new AppendTo(iconHolder));
    const title = createElement("div", new TextContent(node.name), new ClassList("app-title"), new AppendTo(v1));
    const controls = createElement("div", new ClassList("app-controls"), new AppendTo(header), new ElementEvent("mousedown", ElementEvents.NoPropagation));
    const minimize = createElement("div", new ClassList("minimize"), new AppendTo(controls));
    const maximize = createElement("div", new ClassList("maximize"), new AppendTo(controls));
    const close = createElement("div", new ClassList("close"), new AppendTo(controls));
    const content = createElement("div", new ClassList("app-content"), new AppendTo(holder));

    windows.appendChild(holder);

    const navbarHolder = createElement("div", new ClassList("navbar-icon"), new Data("uuid", node.uuid), new ElementEvent("click", ElementEvents.navbarIconClick));
    const navbarButton = createElement("div", new ClassList("navbar-button-content"), new AppendTo(navbarHolder));
    const navbarIcon = createElement("img", new Src(getIcon(node)), new AppendTo(navbarButton));
    appendBefore(navbarHolder, document.querySelector("#navbar > div.navbar-spacer"));

    const appIframeLoaded = () => {
        // cl("loaded");
        navbarHolder.classList.add("running");
        // iframe.contentWindow.postMessage("toIframe", location.origin);
    };
    let sandBox = new SandBox();
    if (!node.name.includes(".pdf")) {
        sandBox = new SandBox("allow-downloads", "allow-forms", "allow-modals", "allow-orientation-lock", "allow-pointer-lock", "allow-popups", "allow-popups-to-escape-sandbox", "allow-presentation", "allow-same-origin", "allow-scripts", "allow-storage-access-by-user-activation", "allow-top-navigation", "allow-top-navigation-by-user-activation", "allow-top-navigation-to-custom-protocols")
    }
    const iframe = createElement("iframe", new Src(getDestination(node)), sandBox,
        new ElementEvent("load", appIframeLoaded), new ElementEvent("mouseover", ElementEvents.appIframeMouseOver), new ElementEvent("mouseout", ElementEvents.appIframeMouseOut),
        new AppendTo(content), new ElementEvent("dragenter", (event)=>{
            cl(999);
        }));
    iframe.allow = "accelerometer *; attribution-reporting *; autoplay *; bluetooth *; browsing-topics *; camera *; compute-pressure *; display-capture *; encrypted-media *; fullscreen *; gamepad *; gyroscope *; hid *; identity-credentials-get *; idle-detection *; local-fonts *; magnetometer *; microphone *; microphone *; otp-credentials *; payment *; picture-in-picture *; publickey-credentials-create *; publickey-credentials-get *; screen-wake-lock *; serial *; storage-access *; usb *; web-share *; window-management *; window-management"
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
    dragApp(holder);
    minimizeApp(minimize);
    maximizeApp(maximize, header);
    closeApp(close);
    iframe.contentWindow.postMessage("Tu máš Áj Frejme", "*");
    selectApp(node.uuid);
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
    let window2 = window.open(textFile, "log." + new Date() + ".txt");
    // window2.onload = e => window.URL.revokeObjectURL(textFile);
}
async function changeFile() {
    let file = input.files[0];
    let reader = new FileReader();
    let data = reader.readAsArrayBuffer(file)
    reader.addEventListener("load", readFile);

    input.value = null;
    cl(await uploadFiles(data));
}

// input.addEventListener('change', changeFile);



async function uploadFiles(data) {
    const url = "https://zwa.toad.cz/~xklima/vypisform.php";
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