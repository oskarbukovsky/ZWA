const getDirectory = () => {
    if (!window.showDirectoryPicker) {
        alert('Unsupported Browser Notice');
        return;
    }
    const verify = confirm('Ask user to confirm');
    if (!verify) return 'File picker canceled.';
    return window.showDirectoryPicker();
};

async function updateDirectory() {
    const directoryHandle = await getDirectory();
    console.log('directoryHandle', directoryHandle);
    for await (let handle of directoryHandle.values()) {
        console.log('handle', handle);
    }
}

function bool(value) {
    return (/true/).test(value);
}

function createSelection(field, start, end) {
    if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end - start);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}

function clearSelection() {
    if (window.getSelection) { window.getSelection().removeAllRanges(); }
    else if (document.selection) { document.selection.empty(); }
}

desktop.querySelectorAll(".icon figcaption").forEach((el) => {
    el.addEventListener("dblclick", (event) => {
        let element = event.toElement;
        if (element.readOnly) {
            createSelection(element, 0, element.value.lastIndexOf('.'))
            element.readOnly = !element.readOnly
        }
    });
    el.addEventListener("focusout", (event) => {
        event.srcElement.readOnly = true;
        clearSelection()
    })
})

const isElementLoaded2 = async selector => {
    while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector);
};

const isElementLoaded = async selector => {
    while (selector === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return selector;
};

desktop.querySelectorAll(".icon figcaption textarea").forEach((el) => {
    el.addEventListener("input", (event) => {
        auto_grow(event.target)
    })
    // isElementLoaded(el).then((selector) => {
    //     auto_grow(selector)
    // })
    el.addEventListener("focusout", (event) => {
        // event.srcElement.style.height = "2lh";
    })
    el.addEventListener("click", (event) => {
        event.preventDefault();
    })
});

function auto_grow(element) {
    element.style.height = "1px !important";
    element.style.height = (element.scrollHeight) + "px !important";
}

function cssVar(variableName, value) {
    document.querySelector(':root').style.setProperty(variableName, value)
}

setInterval(function () {
    var dt = new Date();
    document.getElementById("datetime").innerHTML = (("0" + dt.getHours()).slice(-2)) + ":" +
        (("0" + dt.getMinutes()).slice(-2)) + ":" + (("0" + dt.getSeconds()).slice(-2)) + "<br>" + (("0" + dt.getDate()).slice(-2)) + "." + (("0" +
            (dt.getMonth() + 1)).slice(-2)) + "." + (dt.getFullYear());
}, 999);