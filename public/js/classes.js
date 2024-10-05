class dbShape {
    constructor(name, columns, keyPath = null) {
        this.name = name;
        this.columns = columns;
        this.keyPath = keyPath || "id";
    }
}

class vPermission {
    constructor(canDelete = true, canView = true) {
        this.canDelete = canDelete;
        this.canView = canView;
    }
}

// crypto.randomUUID()
class user {
    constructor(username, uuid, icon, navbarHeight, navbarTransparency) {
        this.username = username;
        this.uuid = uuid;
        this.icon = icon;
        this.navbarHeight = navbarHeight;
        this.navbarTransparency = navbarTransparency;
    }
}
class vNode {
    constructor(id, type, timeCreate, timeEdit, timeRead, owner, permissions, name, description, size, data) {
        this.id = id;

        this.type = type;

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