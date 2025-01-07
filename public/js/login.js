"use strict";

/**
 * @file Login page script
 * @author Jan Oskar Bukovský
 */


/**
 * Sets up event listeners for the login and register forms once the DOM content is loaded.
 * The event listeners handle form submission and call the `authSubmit` function to process the form data.
 */
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
        await authSubmit(event);
    });
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        await authSubmit(event);
    });
});

/**
 * Sets the login page wallpaper once the DOM content is loaded.
 * Fetches the wallpaper URL from a cookie or retrieves a new one from an API if the cookie is not set or invalid.
 * Updates the CSS variable for the wallpaper and sets a cookie with the new wallpaper URL.
 */
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

/**
 * Handles the form submission for login and registration forms.
 * Prevents the default form submission, processes the form based on its ID,
 * and plays an animation if the form is successfully handled.
 * @param {Event} event - The form submission event.
 */
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

window.addEventListener("popstate", (event) => {
    console.log(
        `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
    );
});

/**
 * Handles the login process.
 * Logs the login attempt and returns true to indicate successful handling.
 * @returns {boolean} Returns true if the login process is handled successfully.
 */
async function handleLogin() {
    // loginPassword.value = await sha256Hash(loginPassword.value);
    cl("Login:");
    const response = await ajax({ "method": "login", "username": loginUsername.value, "password": loginPassword.value }, "auth.php");
    if (response.status !== "ok") {
        let url = new URL(location);
        url.searchParams.set("type", response.method);
        url.searchParams.set("error", response.details);
        processLoginErrors(url);
        return false;
    }
    return true;
}

/**
 * Handles the registration process.
 * Logs the registration attempt and checks if the passwords match.
 * Returns false if the passwords do not match, otherwise returns true.
 * @returns {boolean} Returns true if the registration process is handled successfully, false otherwise.
 */
async function handleRegister() {
    // registerPassword.value = await sha256Hash(registerPassword.value);
    // registerPasswordAgain.value = await sha256Hash(registerPasswordAgain.value);
    cl("Register:");
    if (registerPassword.value !== registerPasswordAgain.value) {
        return false;
    }
    const response = await ajax({ "method": "register", "username": registerUsername.value, "password": registerPassword.value, "passwordAgain": registerPasswordAgain.value }, "auth.php");
    if (response.status !== "ok") {
        let url = new URL(location);
        url.searchParams.set("type", response.method);
        url.searchParams.set("error", response.details);
        processLoginErrors(url);    
        return false;
    }
    return true;
}

/**
 * Handles the `pageshow` event.
 * Resets the login animation and clears form inputs if the page was loaded from the cache.
 * @param {PageTransitionEvent} event - The pageshow event.
 */
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

// In rare case user gets to this page inside of the desktop environment (probably due to bad handled session timeout) give that info to the app
if (pageInIframe()) {
    window.top.postMessage(["sessionTimeout"]);
}