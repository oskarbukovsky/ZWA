"use strict";

/**
 * @file Explorer page script
 * @author Jan Oskar Bukovský
 */

const urlParams = new URLSearchParams(window.location.search);
const folder = urlParams.get("folder");

window.onmessage = function (event) {
    // console.log(event);
    if (event.origin != location.origin) {
        cl("📕 Origins do not match!!!")
        return;
    }
    console.log("receivedFromParent: ", event.data);
};

/**
 * Initializes the explorer once the DOM content is loaded.
 * Opens the indexedDB, processes vNodes, updates the explorer icons,
 * and sets up event listeners for file selection.
 */
document.addEventListener("DOMContentLoaded", async () => {
    cl("|📙 Opening indexedDB");
    await openDb();
    cl("|📙 Processing vNodes...");
    await processVNodes(vNodes);

    cl("|📙 Processing explorer...");
    await processExplorerIcons(vNodes);
    countSelectedFiles();
    countAllFiles();

    files.querySelectorAll(".file").forEach((element) => {
        element.addEventListener("click", () => {
            event.stopPropagation();
            if (!is_key_down("Control")) {
                deselectAll();
            }
            element.classList.toggle("selected");
            document.querySelectorAll("#files > *").forEach((element) => { element.classList.remove("last-selected"); });
            element.classList.add("last-selected");
            countSelectedFiles();
        });
    });

    document.body.focus();
});

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

/**
 * Sorts files based on the specified criteria.
 * @param {HTMLElement} sortBy - The HTML element representing the sorting criteria.
 */
function sort(sortBy) {
    cl("Sorting files by: " + sortBy.classList[0]);
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

// Handles right mouse button click on the explorer for files and folders
document.addEventListener("contextmenu", (event) => {
    closeAllExplorerContextMenus();
    event.preventDefault();
    const container = createElement("div", new ClassList("context-menu", "open", "no-select"), new ElementEvent("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
    }), new ElementEvent("click", (event) => {
        container.remove();
    }));

    let timeout;
    let newPopup;
    const createNew = createElement("span", new ClassList("extra", "material-symbols-rounded-after"), new TextContent("Nový"), new AppendTo(container), new ElementEvent("mouseenter", (event) => {
        timeout = setTimeout(() => {
            if (!newPopup && createNew.matches(':hover')) {
                newPopup = createElement("div", new ClassList("context-menu", "open", "no-select"), new AppendTo(createNew));
                const newFolder = createElement("span", new TextContent("Složka"), new AppendTo(newPopup), new ElementEvent("click", ElementEvents.folderCreate));
                const newHr = createElement("hr", new AppendTo(newPopup));
                const newText = createElement("span", new TextContent("Textový dokument"), new AppendTo(newPopup), new ElementEvent("click", ElementEvents.fileCreate));

                newPopup.style.left = createNew.getBoundingClientRect().width + 1 + "px";
                if (newPopup.getBoundingClientRect().right > files.getBoundingClientRect().right) {
                    newPopup.style.left = "unset";
                    newPopup.style.right = createNew.getBoundingClientRect().width + 1 + "px";

                }
                newPopup.style.bottom = "-2px";
            }
        }, 450);
    }), new ElementEvent("mouseleave", (event) => {
        if (newPopup) {
            createNew.querySelectorAll(".context-menu").forEach(element => {
                element.remove();
            });
            newPopup = null;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = null;
        }
    }), new ElementEvent("click", (event) => {
        // event.stopImmediatePropagation();
    }));


    const properties = createElement("span", new TextContent("Vlastnosti"), new AppendTo(container));

    positionContextMenu(container, files);
});

/**
 * Deselects all files by removing the "selected" class from each file element.
 */
function deselectAll() {
    document.querySelectorAll("#files > *").forEach((element) => {
        element.classList.remove("selected");
    });
}

/**
 * Updates the footer with the number and total size of selected files.
 */
function countSelectedFiles() {
    const selected = files.querySelectorAll(".file.selected");
    if (selected.length > 0) {
        let totalSelectedSize = 0;
        let selectedSizes = [];
        files.querySelectorAll(".file.selected").forEach((element) => { selectedSizes.push(element.querySelector(".size").textContent.split(" ")) });
        selectedSizes.forEach((element) => {
            totalSelectedSize += element[0] * sizePrefixes[element[1]];
        });
        // cl("Selected size: ", selectedSizes, "Total: ", totalSelectedSize);
        document.querySelector("#footer > .selected").textContent = "Počet vybraných položek: " + selected.length + "; " + sizeNumberToString(totalSelectedSize);
    } else {
        document.querySelector("#footer > .selected").textContent = "";
    }
}

/**
 * Updates the CSS variable with the total number of files.
 */
function countAllFiles() {
    // TODO: bug when ::after cannot have content from var ?
    cssVar("--files-total", files.querySelectorAll(".file").length);
}

// Handling keyboard event for selecting and deselecting all files
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key == "a" || event.key == "A")) {
        const allFiles = files.querySelectorAll(".file")
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

// Handling keyboard event for navigating through files
document.addEventListener("keydown", async (event) => {
    event.preventDefault();
    if (event.ctrlKey && (event.key == "a" || event.key == "A")) {
        const allFiles = files.querySelectorAll(".file")
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
            files.querySelectorAll(".selected").forEach(async (element) => {
                // cl("##########: " + element.dataset.uuid);
                // const node = await localDatabase.getColumn("vNodes", "uuid", element.dataset.uuid);
                // window.top.postMessage(["appOpen", node[0]]);
                explorerOpenApp(event, element);
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

// Handling of the files uploads area leave
window.addEventListener("dragleave", (event) => {
    if(event.target.id == "files") {
        document.querySelector(".uploading").classList.remove("upload");
    }
});

// Handling of the files uploads
document.body.addEventListener("dragenter", (event) => {
    event.preventDefault();
    document.querySelector(".uploading").classList.add("upload");
});
document.body.addEventListener("drop", (event) => {
    document.querySelector(".uploading").classList.remove("upload");
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files.length) {
        fileUpload.files = files;
        window.top.postMessage(["fileUploading", files]);
    }
});

// Fixes sometimmes buggy mouse events over the files uploads area
document.addEventListener("click", () => {
    document.querySelector(".uploading").classList.remove("upload");
});

// Propagate click to the main app and close all context menus onClick
window.addEventListener("click", () => {
    window.top.postMessage(["focus"]);
    closeAllExplorerContextMenus();
});
window.addEventListener("dragenter", () => {
    window.top.postMessage(["focus"]);
    closeAllExplorerContextMenus();
});

// Deselect all files on another files click selection
files.addEventListener("click", () => {
    deselectAll();
});