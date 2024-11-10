"use strict";

//TODO: Generated by the server from DB

const userIdentifier = new user("bukovja4", "50eced28-c925-4948-80eb-e4fabe83a41b", null, JSON.stringify(new userSettings("0.8", "43px", "13px", "9px")));

const vNodesOld = [new vNode(
    "10f03bee-a841-44d1-97f4-ba3ae8af4073",
    "root",
    null,
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission(false)),
    userIdentifier.username,
    "Základní složka",
    undefined,
    JSON.stringify(new vData())
), new vNode(
    "dc7a8dc1-6656-4671-863b-7df885d61388",
    "trash",
    "10f03bee-a841-44d1-97f4-ba3ae8af4073",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission(false)),
    "Koš",
    "Obsahuje smazané soubory a složky",
    undefined,
    JSON.stringify(new vData())
), new vNode(
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    "desktop",
    "10f03bee-a841-44d1-97f4-ba3ae8af4073",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission(false)),
    "Plocha",
    "Obsahuje soubory a složky na ploše",
    undefined,
    JSON.stringify(new vData())
), new vNode(
    "27106875-6cf7-4666-bcd0-3eec4ddc10af",
    "documents",
    "10f03bee-a841-44d1-97f4-ba3ae8af4073",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission(false)),
    "Dokumenty",
    "Složka pro ukládání dokumentů",
    undefined,
    JSON.stringify(new vData())
), new vNode(
    "13915013-2ea7-423b-9a84-7fb07c9ec9d2",
    "images",
    "10f03bee-a841-44d1-97f4-ba3ae8af4073",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission(false)),
    "Obrázky",
    "Složka pro ukládání obrázků",
    undefined,
    JSON.stringify(new vData())
),

new vNode(
    "44c7bc8c-8201-4b61-a4a7-7ac488505a3b",
    "link",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    Date.now() - 1000,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Koš",
    "Složka pro ukládání dokumentů",
    undefined,
    // ["vLinkTrash://"]
    JSON.stringify(new vData(["vLinkTrash://"]))
),
new vNode(
    "0f96d238-cc98-4825-9007-dc6bea0bc753",
    "file",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    2,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Nový textový dokument.txt",
    "Typ: Textový dokument",
    undefined,
    // ["/2/"]
    JSON.stringify(new vData(["/2/"]))
), new vNode(
    "66285580-f084-43fd-b3aa-308399055455",
    "file",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    2,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "sample.pdf",
    "Typ: PDF dokument",
    957,
    // ["/2/"]
    JSON.stringify(new vData(["/2/"]))
), new vNode(
    "6c1e65b9-ab3e-426a-b6ba-d0a1a304061b",
    "link",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    1,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Tento Počítač",
    "Umístění: Tento Počítač",
    undefined,
    // ["vComputer://"]
    JSON.stringify(new vData(["vComputer://"]))
), new vNode(
    "f7d9830f-90d0-45b4-b612-d46d15a289e6",
    "file",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    6,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Dokument1.txt",
    "Typ: Textový dokument",
    undefined,
    // ["/2/"]
    JSON.stringify(new vData(["/2/"]))
),  new vNode(
    "9e27b8bb-dfeb-404b-bf4e-08fa59744206",
    "link",
    "704d99cf-0e37-4797-8605-fa844f25efe5",
    7,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Administrace",
    "Správa uživatelských profilů",
    undefined,
    // ["admin://"]
    JSON.stringify(new vData(["admin://"]))
), 
new vNode(
    "6c6bc7b9-0678-420b-a27f-bfadff021ece",
    "file",
    "27106875-6cf7-4666-bcd0-3eec4ddc10af",
    3,
    Date.now(),
    0,
    "50eced28-c925-4948-80eb-e4fabe83a41b",
    JSON.stringify(new vPermission()),
    "Testing.txt",
    "Typ: Textový dokument",
    undefined,
    // ["/3/"]
    JSON.stringify(new vData(["/3/"]))
)
];

// const vFiles = [new vFile("df704090-af2c-4d07-98cc-446218660e1c", "user-data/50eced28-c925-4948-80eb-e4fabe83a41b/a123456789.txt")];

// const vNodes = [new vNode(
//     0,
//     "root",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(false),
//     ["V:", 1, 2, 3, 4],
//     undefined
// ), new vNode(
//     1,
//     "desktop",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(false),
//     ["Plocha", 0, 3, 4, 5, 6, 7, 8, 9],
//     undefined
// ), new vNode(
//     2,
//     "trash",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(false),
//     ["Koš", 0, 4],
//     undefined
// ), new vNode(
//     3,
//     "documents",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(false),
//     ["Koš", 0, 4],
//     undefined
// ), new vNode(
//     4,
//     "images",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(false),
//     ["Koš", 0, 4],
//     undefined
// ), new vNode(
//     3,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "Koš",
//         undefined,
//         "Obsahuje smazané soubory a složky.",
//         [0, 0],
//         "trash",
//         "trash://"
//     )],
//     512
// ), new vNode(
//     4,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     {
//         1: 2
//     },
//     [1, new desktopIcon(
//         "Mafia.url",
//         "https://preview.redd.it/1anfk1m03f371.png?width=800&format=png&auto=webp&s=c515e74d83c6737cdd8340891b810a509a175b83",
//         "Mafia 1",
//         [1, 0],
//         "link",
//         "https://cs.wikipedia.org/wiki/Mafia:_The_City_of_Lost_Heaven"
//     )],
//     512
// ), new vNode(
//     5,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "Error.url",
//         "fakeimg.png",
//         "Non-Existing image test",
//         [2, 0],
//         "link",
//         "https://example.com/"
//     )],
//     512
// ), new vNode(
//     6,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "Subnautica.url",
//         undefined,
//         "Subnautica",
//         [3, 0],
//         "link",
//         "https://en.wikipedia.org/wiki/Subnautica"
//     )],
//     512
// ), new vNode(
//     7,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "TestFolder",
//         undefined,
//         undefined,
//         [4, 0],
//         "folder",
//         "cloud-folder://TestFolder"
//     )],
//     512
// ), new vNode(
//     8,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "Nový textový dokument.txt",
//         undefined,
//         "Typ: Textový dokument",
//         [5, 0],
//         "file/text",
//         "cloud-file://Nový textový dokument.txt"
//     )],
//     512
// ), new vNode(
//     9,
//     "desktopIcon",
//     Date.now() - 1000,
//     Date.now(),
//     0,
//     "50eced28-c925-4948-80eb-e4fabe83a41b",
//     new vPermission(),
//     [1, new desktopIcon(
//         "Projekt.pdf",
//         undefined,
//         "Typ: PDF dokument",
//         [6, 0],
//         "pdf",
//         "cloud-file://Projekt.pdf"
//     )],
//     512
// )]