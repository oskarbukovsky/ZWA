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
    if( field.createTextRange ) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end-start);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
} 

desktop.querySelectorAll(".icon figcaption").forEach((el) => {
    el.addEventListener("dblclick", (event) => {
        let element = event.toElement;
        if (element.readOnly) {
            createSelection(element, 0, element.value.lastIndexOf('.'))
        }
        element.readOnly = !element.readOnly
    });
    el.addEventListener("focusout", (event) => {
        event.srcElement.readOnly = true;
    })
})