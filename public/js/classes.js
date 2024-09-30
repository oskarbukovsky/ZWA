class dbShape {
    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
    }
}

class desktopIcon {
    constructor(id, name, icon, description, timeCreate, timeEdit, timeRead, position, target, type, size) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.timeCreate = timeCreate;
        this.timeEdit = timeEdit;
        this.timeRead = timeRead;
        this.position = position;
        this.target = target;
        this.type = type
        this.size = size;
    }
}

class navbarIcon {
    constructor(id, name, icon, index, target) {
        this.id = id;
        this.icon = icon;
        this.name = name;
        this.index = index;
        this.target = target;
    }
}

class directoryHandler {
    constructor(handler) {
        this.handler = handler;
    }
}

class fileHandler {
    constructor(handler) {
        this.handler = handler;
    }
}