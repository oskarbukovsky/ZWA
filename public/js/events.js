"use strict";

class ElementEvents {
    static appIframeMouseOver = (event) => {
        myConfObj.iframeMouseOver = true;
        myConfObj.lastIframe = event.target;
    };

    static appIframeMouseOut = () => {
        myConfObj.iframeMouseOver = false;
        myConfObj.lastIframe = null;
    };

    static navbarIconClick = (event) => {
        setTimeout(() => { }, 20);
        const icon = bubbleToClass(event, "navbar-icon");
        const id = icon.dataset.id;
        if (icon.classList.contains("active")) {
            icon.classList.remove("active");
            windows.querySelector('[data-id="' + id + '"]').classList.add("minimized");
            windows.querySelector('[data-id="' + id + '"]').classList.remove("active");
        } else {
            icon.classList.add("active");
            windows.querySelector('[data-id="' + id + '"]').classList.remove("minimized");
            windows.querySelector('[data-id="' + id + '"]').classList.add("active");
        }
    };
}

window.addEventListener('blur', () => {
    if (myConfObj.iframeMouseOver) {
        closeMainMenu();
        closeSearchbarMenu()
        closeDesktopCalendar();
        deselectDesktopIcon();
        deselectAllApps();
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

document.querySelectorAll(".calendar-navigation span").forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        if (month < 0 || month > 11) {
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        }
        manipulateCalendar();
    });
});

const appIframeLoaded = () => {
    cl("loaded");
    navbarHolder.classList.add("running");
    navbarHolder.classList.add("active");
};

window.onmessage = function(event) {
    cl("receivedFromIframe: ", event);
};

addEventListener("resize", () => {
    resizing.windowResize();
});