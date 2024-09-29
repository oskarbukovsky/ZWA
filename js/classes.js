class dbShape {
    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
    }
}

class desktopIcon {
    constructor(icon, name, description, timeCreate, timeEdit, timeRead, position, target) {
        this.icon = icon;
        this.name = name;
        this.description = description;
        this.timeCreate = timeCreate;
        this.timeEdit = timeEdit;
        this.timeRead = timeRead;
        this.position = position;
        this.target = target;
    }
}

class navbarIcon {
    constructor(icon, name, index, target) {
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