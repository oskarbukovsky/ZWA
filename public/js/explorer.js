const urlParams = new URLSearchParams(window.location.search);

const folder = urlParams.get("folder");

window.onmessage = function(event) {
    cl("receivedFromParent: ", event);
    alert(event.data);
};

window.top.postMessage("Tu máš taťko", "*")