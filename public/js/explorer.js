const urlParams = new URLSearchParams(window.location.search);

const folder = urlParams.get("folder");
let parent;

window.onmessage = function(event) {
    parent = event.source
    console.log(event.source);
    console.log("receivedFromParent: ", event);
};

window.top.postMessage("Tu máš taťko", "*")
