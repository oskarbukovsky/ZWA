"use strict";

//TODO: Generated by the server from DB

const desktopIcons = [new desktopIcon(
    0,
    "Koš",
    undefined,
    "Obsahuje smazané soubory a složky.",
    [0, 0],
    "trash://",
    "trash"
), new desktopIcon(
    2,
    "Mafia.url",
    "https://preview.redd.it/1anfk1m03f371.png?width=800&format=png&auto=webp&s=c515e74d83c6737cdd8340891b810a509a175b83",
    "Mafia 1",
    [1, 0],
    "https://cs.wikipedia.org/wiki/Mafia:_The_City_of_Lost_Heaven",
    "link"
), new desktopIcon(
    3,
    "Error.url",
    "fakeimg.png",
    "Non-Existing image test",
    [2, 0],
    "https://example.com/",
    "link"
), new desktopIcon(
    4,
    "Subnautica.url",
    undefined,
    "Subnautica",
    [3, 0],
    "https://en.wikipedia.org/wiki/Subnautica",
    "link"
), new desktopIcon(
    "TestFolder",
    undefined,
    undefined,
    [4, 0],
    "folder",
    "cloud-folder://TestFolder"
), new desktopIcon(
    "Nový textový dokument.txt",
    undefined,
    "Typ: Textový dokument",
    [5, 0],
    "text",
    "cloud-file://Nový textový dokument.txt"
), new desktopIcon(
    "Projekt.pdf",
    undefined,
    "Typ: PDF dokument",
    [6, 0],
    "pdf",
    "cloud-file://Projekt.pdf"
)
];

const userIdentifier = new user("bukovja4", "50eced28-c925-4948-80eb-e4fabe83a41b", null, 47, 0.8);

const vNodes = [new vNode(
    0,
    "root",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(false),
    ["V:", 1, 2],
    undefined
), new vNode(
    1,
    "desktop",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(false),
    ["Plocha", 0, 3, 4, 5, 6, 7, 8, 9],
    undefined
), new vNode(
    2,
    "trash",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(false),
    ["Koš", 0, 4],
    undefined
), new vNode(
    3,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "Koš",
        undefined,
        "Obsahuje smazané soubory a složky.",
        [0, 0],
        "trash",
        "trash://"
    )],
    512
), new vNode(
    4,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    {
        1:2
    },
    [1, new desktopIcon(
        "Mafia.url",
        "https://preview.redd.it/1anfk1m03f371.png?width=800&format=png&auto=webp&s=c515e74d83c6737cdd8340891b810a509a175b83",
        "Mafia 1",
        [1, 0],
        "link",
        "https://cs.wikipedia.org/wiki/Mafia:_The_City_of_Lost_Heaven"
    )],
    512
), new vNode(
    5,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "Error.url",
        "fakeimg.png",
        "Non-Existing image test",
        [2, 0],
        "link",
        "https://example.com/"
    )],
    512
), new vNode(
    6,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "Subnautica.url",
        undefined,
        "Subnautica",
        [3, 0],
        "link",
        "https://en.wikipedia.org/wiki/Subnautica"
    )],
    512
), new vNode(
    7,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "TestFolder",
        undefined,
        undefined,
        [4, 0],
        "folder",
        "cloud-folder://TestFolder"
    )],
    512
), new vNode(
    8,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "Nový textový dokument.txt",
        undefined,
        "Typ: Textový dokument",
        [5, 0],
        "file/text",
        "cloud-file://Nový textový dokument.txt"
    )],
    512
), new vNode(
    9,
    "desktopIcon",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    new vPermission(),
    [1, new desktopIcon(
        "Projekt.pdf",
        undefined,
        "Typ: PDF dokument",
        [6, 0],
        "pdf",
        "cloud-file://Projekt.pdf"
    )],
    512
)]