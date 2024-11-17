"use strict";

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
        await authSubmit(event);
    });
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        await authSubmit(event);
    });
});

async function authSubmit(event) {
    event.preventDefault();

    switch (event.target.id) {
        case "loginForm":
            if (!await handleLogin()) {
                return;
            }
            break;
        case "registerForm":
            if (!await handleRegister()) {
                return;
            }
            break;
        default:
            return;
    }

    loginAnimation.classList.remove("hidden");
    authForms.classList.add("hidden");
    loginAnimation.play();
    await sleep(3125);
    event.target.submit();
}

async function handleLogin() {
    cl("Login:");
    loginPassword.value = await sha256Hash(loginPassword.value);
    return true;
}

async function handleRegister() {
    cl("Register:");
    if (registerPassword.value !== registerPasswordAgain.value) {
        return false;
    }

    registerPassword.value = await sha256Hash(registerPassword.value);
    registerPasswordAgain.value = await sha256Hash(registerPasswordAgain.value);
    return true;
}

window.onpageshow = function (event) {
    if (event.persisted) {
        loginAnimation.load();
        loginAnimation.pause();
        loginAnimation.classList.add("hidden");
        authForms.classList.remove("hidden");
        loginPassword.value = "";
        registerPassword.value = "";
        registerPasswordAgain.value = "";
    }
};

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