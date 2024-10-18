"use strict";

class ClassList {
    constructor(...args) {
        args.forEach((element, index) => {
            this[index] = element;
        });
    }

    [Symbol.iterator]() {
        var index = -1;
        return {
            next: () => ({ value: this[++index], done: !(index in this) })
        };
    };
}

class Id {
    constructor(id) {
        this.id = id;
    }
}

class Src {
    constructor(src) {
        this.src = src;
    }
}

class Name {
    constructor(name) {
        this.name = name;
    }
}

class TextContent {
    constructor(textContent) {
        this.textContent = textContent;
    }
}

class Cols {
    constructor(cols) {
        this.cols = cols;
    }
}

class ReadOnly {
    constructor(readOnly) {
        this.readOnly = readOnly;
    }
}

class Data {
    constructor(key, value) {
        if (!key) {
            cl("No key provided!");
            return null;
        }
        this.key = key;
        this.value = value;
    }
}

class AppendTo {
    constructor(selectorOrElement) {
        if (!selectorOrElement) {
            cl("None selector or element provided!");
            return null;
        }
        if (typeof selectorOrElement === "string") {
            this.element = document.querySelector(selectorOrElement);
        } else if (selectorOrElement instanceof HTMLElement) {
            this.element = selectorOrElement;
        } else {
            cl("Invalid selector or element:", selectorOrElement, "\n", this.element);
        }
    }
}

class ElementEvent {
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
}

class dbShape {
    constructor(name, columns, keyPath = null) {
        this.name = name;
        this.columns = columns;
        this.keyPath = keyPath || "id";
    }
}

class vPermission {
    constructor(canDelete = true) {
        this.canDelete = canDelete;
    }
    // constructor(canDelete = true, canView = true) {
    //     this.canDelete = canDelete;
    //     this.canView = canView;
    // }
}

class userSettings {
    constructor(CssNavbarTransparency, CssNavbarHeigh, CssAppControlsSize, CssAppControlsExtra) {
        this.CssNavbarTransparency = CssNavbarTransparency;
        this.CssNavbarHeigh = CssNavbarHeigh;
        this.CssAppControlsSize = CssAppControlsSize;
        this.CssAppControlsExtra = CssAppControlsExtra;
    }
}

// crypto.randomUUID()
class user {
    constructor(username, uuid, icon, settings = new userSettings()) {
        this.username = username;
        this.uuid = uuid;
        this.icon = icon;
        this.settings = settings;
    }
}
class vNode {
    constructor(id, type, parent, timeCreate, timeEdit, timeRead, owner, permissions = new vPermission(), name, description, size, data = []) {
        this.id = id;

        this.type = type;
        this.parent = parent;

        this.timeCreate = timeCreate;
        this.timeEdit = timeEdit;
        this.timeRead = timeRead;

        this.owner = owner;
        this.permissions = permissions

        this.name = name;
        this.description = description;
        this.size = size;

        this.data = data;
    }
}

// class vFile {
//     constructor(uuid, urlReference) {
//         this.uuid = uuid;
//         this.urlReference = urlReference;
//     }
// }

// class desktopIcon {
//     constructor(name, icon, description, timeCreate, timeEdit, timeRead, position, target, type, size) {
//         this.name = name;
//         this.icon = icon;
//         this.description = description;
//         this.position = position;
//         this.type = type;
//         this.target = target;
//     }
// }

// class navbarIcon {
//     constructor(id, name, icon, index, target) {
//         this.id = id;
//         this.icon = icon;
//         this.name = name;
//         this.index = index;
//         this.target = target;
//     }
// }

// class directoryHandler {
//     constructor(handler) {
//         this.handler = handler;
//     }
// }

// class fileHandler {
//     constructor(handler) {
//         this.handler = handler;
//     }
// }