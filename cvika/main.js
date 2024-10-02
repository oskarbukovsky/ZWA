async function login(event) {
    event.preventDefault();
    loginAnimation.classList.remove("hidden");
    loginAnimation.play();
    await sleep(5250);
    event.target.submit();
}


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}