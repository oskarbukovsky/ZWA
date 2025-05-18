"use strict";

/**
 * @file Utility file for classes.
 * @author Jan Oskar Bukovský
 */


/**
 * Decodes a string containing HTML special characters to their corresponding characters.
 * @param {string} text - The text to decode.
 * @returns {string} The decoded text.
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

/**
 * Class containing behavior for class handling on element creating.
 */
class ClassList {
    /**
     * Creates an instance of ClassList.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
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

/**
 * Class containing behavior for sandbox handling on element creating.
 */
class SandBox {
    /**
     * Creates an instance of SandBox.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
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

/**
 * Class containing behavior for id handling on element creating.
 */
class Id {
    /**
     * Creates an instance of Id.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(id) {
        this.id = id;
    }
}

/**
 * Class containing behavior for src handling on element creating.
 */
class Src {
    /**
     * Creates an instance of Src.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(src) {
        this.src = src;
    }
}

/**
 * Class containing behavior for name handling on element creating.
 */
class Name {
    /**
     * Creates an instance of Name.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(name) {
        this.name = name;
    }
}

/**
 * Class containing behavior for textContent handling on element creating.
 */
class TextContent {
    /**
     * Creates an instance of TextContent.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(textContent) {
        this.textContent = textContent;
    }
}

/**
 * Class containing behavior for cols handling on element creating.
 */
class Cols {
    /**
     * Creates an instance of Cols.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(cols) {
        this.cols = cols;
    }
}

/**
 * Class containing behavior for readOnly handling on element creating.
 */
class ReadOnly {
    /**
     * Creates an instance of ReadOnly.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(readOnly) {
        this.readOnly = readOnly;
    }
}

/**
 * Class containing behavior for type handling on element creating.
 */
class Type {
    /**
     * Creates an instance of Type.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(type) {
        this.type = type;
    }
}

/**
 * Class containing behavior for alt handling on element creating.
 */
class Alt {
    /**
     * Creates an instance of Alt.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(alt) {
        this.alt = alt;
    }
}

/**
 * Class containing behavior for AriaHidden handling on element creating.
 */
class AriaHidden {
    /**
     * Creates an instance of AriaHidden.
     */
    constructor(ariaHidden = true) {
        this.ariaHidden = ariaHidden;
    }
}

/**
 * Class containing behavior for data handling on element creating.
 */
class Data {
    /**
     * Creates an instance of Data.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
    constructor(key, value) {
        if (!key) {
            cl("No key provided!");
            return null;
        }
        this.key = key;
        this.value = value;
    }
}

/**
 * Class containing behavior for creation position handling on element creating.
 */
class AppendTo {
    /**
     * Creates an instance of AppendTo.
     * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
     */
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

/**
 * Class containing behavior for events handling on element creating.
 */
class ElementEvent {
    /**
    * Creates an instance of ElementEvent.
    * @param {...*} args - The attributes to be added to the instance and after that to HTMLElement.
    */
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
}

/**
 * Class defining indexedDb shape
 */
class dbShape {
    /**
     * Creates an instance of dbShape.
     * @param {string} name - The name of the database.
     * @param {Array} columns - The columns of the shape.
     * @param {string} [keyPath=null] - The key path of the db.
     */
    constructor(name, columns, keyPath = null) {
        this.name = name;
        this.columns = columns;
        this.keyPath = keyPath || "uuid";
    }
}

/**
 * Class defining vNode permissions
 */
class vPermission {
    /**
     * Creates an instance of vPermission.
     * @param {bool} [canDelete=true] - Flag for access control 
     */
    constructor(canDelete = true) {
        this.canDelete = canDelete;
        // this.canView = canView;
    }
}

/**
 * Class defining vNode data
 */
class vData {
    /**
 * Creates an instance of vPermission.
 * @param {array} [data=[]] - Array of data. Default is empty array.
 */
    constructor(data = []) {
        this.data = data;
    }
}

/**
 * Class defining user saved settings
 */
class userSettings {
    /**
    * Creates an instance of userSettings.
    * @param {string} CssNavbarTransparency - The CSS setting for navbar transparency.
    * @param {string} CssNavbarHeigh - The CSS setting for navbar height.
    * @param {string} CssAppControlsSize - The CSS setting for app controls size.
    * @param {string} CssAppControlsExtra - The CSS setting for additional app controls.
    */
    constructor(CssNavbarTransparency, CssNavbarHeigh, CssAppControlsSize, CssAppControlsExtra) {
        this.CssNavbarTransparency = CssNavbarTransparency;
        this.CssNavbarHeigh = CssNavbarHeigh;
        this.CssAppControlsSize = CssAppControlsSize;
        this.CssAppControlsExtra = CssAppControlsExtra;
    }
}

/**
 * Retrieves all method names from an object, including inherited methods.
 * @param {Object} obj - The object to retrieve methods from.
 * @returns {string[]} An array of method names.
 */
const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

/**
 * Class defining user data in db
 */
class user {
    /**
     * Creates an instance of User.
     * @param {string} username - The username of the user.
     * @param {string} uuid - The unique identifier of the user.
     * @param {string} [icon=""] - The icon for the user, defaults to an empty string.
     * @param {string} [settings=JSON.stringify(new userSettings())] - The settings for the user, defaults to a new instance of userSettings.
     */
    constructor(username, uuid, icon = "", settings = JSON.stringify(new userSettings())) {
        this.username = username;
        this.uuid = uuid;
        this.icon = htmlSpecialCharsDecode(icon);
        this.settings = JSON.parse(htmlSpecialCharsDecode(settings));
    }
}

/**
 * Class defining vNode content
 */
class vNode {
    /**
     * Creates an instance of vNode.
     * @param {string} uuid - The unique identifier of the node.
     * @param {string} type - The type of the node.
     * @param {string} parent - The parent node identifier.
     * @param {number} timeCreate - The creation time of the node.
     * @param {number} timeEdit - The last edit time of the node.
     * @param {number} timeRead - The last read time of the node.
     * @param {string} owner - The owner of the node.
     * @param {string} [permissions=JSON.stringify(new vPermission())] - The permissions for the node, defaults to a new instance of vPermission.
     * @param {string} name - The name of the node.
     * @param {string} description - The description of the node.
     * @param {number} size - The size of the node.
     * @param {string} [data=JSON.stringify(new vData())] - The data of the node, defaults to a new instance of vData.
     * @param {string} icon - The icon of the node.
     */
    constructor(uuid, type, parent, timeCreate, timeEdit, timeRead, owner, permissions = JSON.stringify(new vPermission()), name, description, size, data = JSON.stringify(new vData()), icon) {
        this.uuid = uuid;

        this.type = type;
        this.parent = parent;

        this.timeCreate = Number(timeCreate);
        this.timeEdit = Number(timeEdit);
        this.timeRead = Number(timeRead);

        this.owner = owner;
        this.permissions = JSON.parse(htmlSpecialCharsDecode(permissions));

        this.name = name;
        this.description = description;
        this.size = !isNaN(Number(size)) ? Number(size) : 0;

        this.data = JSON.parse(htmlSpecialCharsDecode(data));

        this.icon = icon;
    }
}