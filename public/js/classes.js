"use strict";

/**
 * @file Utility file for classes.
 * @author Jan Oskar Bukovský
 */

const htmlSpecialCharsDecode = (text) => {
    const map = {
        '&amp;': '&',
        '&#038;': '&',
        '&nbsp;': ' ',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&#8217;': '’',
        '&#8216;': '‘',
        '&#8211;': '–',
        '&#8212;': '—',
        '&#8230;': '…',
        '&#8221;': '”',
    };

    return text.replace(/\&[\w\d\#]{2,5}\;/g, (m) => map[m] ?? m);
};

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

class SandBox {
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

class Type {
    constructor(type) {
        this.type = type;
    }
}

class Alt {
    constructor(alt) {
        this.alt = alt;
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
        this.keyPath = keyPath || "uuid";
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

class vData {
    constructor(data = []) {
        this.data = data;
    }
}

class userSettings {
    constructor(CssNavbarTransparency, CssNavbarHeigh, CssAppControlsSize, CssAppControlsExtra) {
        this.CssNavbarTransparency = CssNavbarTransparency;
        this.CssNavbarHeigh = CssNavbarHeigh;
        this.CssAppControlsSize = CssAppControlsSize;
        this.CssAppControlsExtra = CssAppControlsExtra;
    }
}

const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

// crypto.randomUUID()
class user {
    constructor(username, uuid, icon = "", settings = JSON.stringify(new userSettings())) {
        this.username = username;
        this.uuid = uuid;
        this.icon = htmlSpecialCharsDecode(icon);
        this.settings = JSON.parse(htmlSpecialCharsDecode(settings));
    }
}
class vNode {
    constructor(uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions = JSON.stringify(new vPermission()), name, description, size, data = JSON.stringify(new vData()), icon) {
        this.uuid = uuid;

        this.type = type;
        this.parent = parent;

        this.timeCreate = Number(timeCreate);
        this.timeEdit = Number(timeEdit);
        this.timeRead = Number(timeRead);

        this.owner = owner;
        // debugger
        this.permissions = JSON.parse(htmlSpecialCharsDecode(permissions));

        this.name = name;
        this.description = description;
        this.size = !isNaN(Number(size)) ? Number(size) : 0;

        this.data = JSON.parse(htmlSpecialCharsDecode(data));

        this.icon = icon;
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