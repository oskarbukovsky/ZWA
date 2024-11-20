"use strict";

const urlParams = new URLSearchParams(window.location.search);

const folder = urlParams.get("folder");
let parent;

window.onmessage = function (event) {
    // console.log(event);
    if (event.origin != location.origin) {
        cl("📕 Origins do not match!!!")
        return;
    }
    console.log("receivedFromParent: ", event.data);
};

document.querySelector("#sorting > .name").addEventListener("click", (event) => {
    sort(event.target);
});
document.querySelector("#sorting > .change").addEventListener("click", (event) => {
    sort(event.target);
});
document.querySelector("#sorting > .type").addEventListener("click", (event) => {
    sort(event.target);
});
document.querySelector("#sorting > .size").addEventListener("click", (event) => {
    sort(event.target);
});

function sort(sortBy) {
    sortBy.classList[0]
    document.querySelectorAll("#sorting > *").forEach((element) => {
        element.classList.remove("by-this");
        if (element != sortBy) {
            element.classList.remove("ascending");
            element.classList.remove("descending");
        }
    });
    sortBy.classList.add("by-this");
    if (sortBy.classList.contains("descending")) {
        sortBy.classList.remove("descending");
        sortBy.classList.add("ascending");
    } else {
        sortBy.classList.remove("ascending");
        sortBy.classList.add("descending");
    }
    // cl("Sorting by: " + sortBy.classList[0] + " - " + sortBy.classList[2]);
    switch (sortBy.classList[0]) {
        case "name":
            // sort by name
            break;
        case "change":
            // sort by change
            break;
        case "type":
            // sort by type
            break;
        case "size":
            // sort by size
            break;
        default:
            break;
    }
}

function deselectAll() {
    document.querySelectorAll("#files > *").forEach((element) => {
        element.classList.remove("selected");
    });
}

function countSelectedFiles() {
    const selected = document.querySelectorAll("#files > .selected");
    if (selected.length > 0) {
        let totalSelectedSize = 0;
        let selectedSizes = [];
        document.querySelectorAll("#files > .selected").forEach((element) => { selectedSizes.push(element.querySelector(".size").textContent.split(" ")) });
        selectedSizes.forEach((element) => {
            totalSelectedSize += element[0] * sizePrefixes[element[1]];
        });
        // cl("Selected size: ", selectedSizes, "Total: ", totalSelectedSize);
        document.querySelector("#footer > .selected").textContent = "Počet vybraných položek: " + selected.length + "; " + sizeNumberToString(totalSelectedSize);
    } else {
        document.querySelector("#footer > .selected").textContent = "";
    }
}

document.querySelectorAll("#files > *").forEach((element) => {
    element.addEventListener("click", () => {
        if (!is_key_down("Control")) {
            deselectAll();
        }
        element.classList.toggle("selected");
        document.querySelectorAll("#files > *").forEach((element) => { element.classList.remove("last-selected"); });
        element.classList.add("last-selected");
        countSelectedFiles();
    });
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key == "a" || event.key == "A")) {
        const allFiles = document.querySelectorAll("#files > *")
        if (allFiles) {
            allFiles[0].classList.remove("last-selected");
        }
        allFiles.forEach((element) => { element.classList.add("selected"); });
        countSelectedFiles();
        // cl("Ctrl + A");
    } else if (event.key == "Escape") {
        deselectAll();
        countSelectedFiles();
    }
});


document.addEventListener("keydown", async (event) => {
    event.preventDefault();
    if (event.ctrlKey && (event.key == "a" || event.key == "A")) {
        const allFiles = document.querySelectorAll("#files > *")
        if (allFiles) {
            allFiles[0].classList.remove("last-selected");
        }
        allFiles.forEach((element) => { element.classList.add("selected"); });
        countSelectedFiles();
        return;
    }
    switch (event.key) {
        case "Escape":
            deselectAll();
            countSelectedFiles();
            break;
        case "Enter":
            files.querySelectorAll(".selected").forEach((element) => {
                // const node = await localDatabase.getColumn("vNodes", "uuid", element.dataset.uuid);
                // appOpen(node[0]);
                window.top.postMessage(["appOpen", "66285580-f084-43fd-b3aa-308399055455"]);
            });
            break;
        case "ArrowUp":
        case "ArrowLeft":
            const up = files.querySelector(".file:has(+ .selected)");
            if (up) {
                if (!event.shiftKey) {
                    deselectAll();
                }
                up.classList.add("selected");
                up.scrollIntoViewIfNeeded(false);
                countSelectedFiles();
            }
            break;
        case "ArrowDown":
        case "ArrowRight":
            const down = files.querySelector(".selected:not(:has(~ .selected)) + *")
            if (down) {
                if (!event.shiftKey) {
                    deselectAll();
                }
                down.classList.add("selected");
                down.scrollIntoViewIfNeeded(false);
                countSelectedFiles();
            }
            break;
        default:
            return;
    }
});

files.querySelectorAll(".file").forEach((element) => {
    element.addEventListener("dblclick", (event) => {
        window.top.postMessage(["appOpen", "66285580-f084-43fd-b3aa-308399055455"]);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    countSelectedFiles();
});