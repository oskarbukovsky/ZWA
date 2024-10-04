"use strict";

async function login(event) {
    event.preventDefault();
    loginAnimation.classList.remove("hidden");
    authForm.classList.add("hidden");
    loginAnimation.play();
    await sleep(5250);
    event.target.submit();
}

window.onpageshow = function(event) {
    if (event.persisted) {
        loginAnimation.load();
        loginAnimation.pause();
        loginAnimation.classList.add("hidden");
        authForm.classList.remove("hidden");
        password.value = "";
    }
};

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}
// var wallpaper ;
window.addEventListener("DOMContentLoaded", async () => {
    let wallpaperCookie = getCookie("loginWallpaper");
    if (wallpaperCookie === null || !isValidUrl(wallpaperCookie)) {
        let wallpaper = await fetch("https://peapix.com/bing/feed?country=us");
        let result = await wallpaper.json().then((result) => result[0].fullUrl);
        document.documentElement.style.setProperty("--image-of-the-day", "url(" + result + ")");
        setCookie("loginWallpaper", result, 4);
        console.log("loaded:", result);
    } else {
        document.documentElement.style.setProperty("--image-of-the-day", "url(" + wallpaperCookie + ")");
        console.log("loaded from cookie:", getCookie("loginWallpaper"));
    }
});

function setCookie(name, value, expiryHours) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryHours * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    return true;
}

function getCookie(name) {
    name = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function isValidUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}