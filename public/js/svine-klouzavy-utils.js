/* eslint-disable no-unused-vars */
"use strict";

function debounce(func, delay) {
    let timeoutId = null;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function throttle(fn, delay) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const usualRefreshRates = [30, 60, 75, 120, 144, 165, 240, 360];

function closestNumberInArray(number, array) {
    return array.reduce(function (prev, curr) {
        return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev;
    });
}

function getFPS() {
    return new Promise(resolve => requestAnimationFrame(t1 => requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))));
}

function vibrateGamepads() {
    for (const gamepad of navigator.getGamepads()) {
        if (!gamepad) continue;
        gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 222,
            weakMagnitude: 1.0,
            strongMagnitude: 1.0
        });
    }
}

const standartLayout = ["xAnalog1", "yAnalog1", "xAnalog2", "yAnalog2"];

// const config = {
//     pusherRadius: 20,
//     puckRadius: 20,
//     deathZone: 0.5,
//     moveSpeed: 1,
//     controlsAsymmetry: 2,
//     goalSize: 1,
//     soundDelayWall: 100,
//     soundDelayPusher: 200
// };

// const state = {
//     gamepads: [],
//     score: [0, 0],
//     gameElements: {
//         puck: null,
//         pushers: [null, null],
//         goals: [null, null],
//         scoreText: null
//     }
// };

const soundDelayPusher = 200;
const soundDelayWall = 100;

const collidePlayback = throttle(() => {
    new Audio("../sound/clank.wav").play();
}, soundDelayPusher);

const collidePlaybackWall = throttle(() => {
    new Audio("../sound/jump.wav").play();
}, soundDelayWall);

function resetPositions() {
    state.gameElements.pushers[0].body.velocity.x = 0;
    state.gameElements.pushers[0].body.velocity.y = 0;
    state.gameElements.pushers[0].x = config.width / 2;
    state.gameElements.pushers[0].y = config.height / 2;

    state.gameElements.pushers[1].body.velocity.x = 0;
    state.gameElements.pushers[1].body.velocity.y = 0;
    state.gameElements.pushers[1].x = config.width / 2;
    state.gameElements.pushers[1].y = config.height / 2;

    state.gameElements.puck.body.velocity.x = 0;
    state.gameElements.puck.body.velocity.y = 0;
    state.gameElements.puck.x = config.width / 2;
    state.gameElements.puck.y = config.height / 2;
}
