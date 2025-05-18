"use strict";

const config = {
	deathZone: 0.5,
	moveSpeed: 0.8,
	controlsAsymmetry: 2,
	goalSize: 1.0,
	puckSize: 1.1,
	pusherSize: 1.0,
	soundDelayWall: 100,
	soundDelayPusher: 200,
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	parent: "Game",
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			gravity: {
				x: 0,
				y: 0,
			},
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

const state = {
	gamepads: [],
	score: [0, 0],
	gameElements: {
		puck: null,
		pushers: [null, null],
		goals: [null, null],
		scoreText: null,
	},
};

// const gameConfig = {
//     type: Phaser.AUTO,
//     width: window.innerWidth,
//     height: window.innerHeight,
//     parent: "Game",
//     physics: {
//         default: "arcade",
//         arcade: {
//             debug: false,
//             gravity: {
//                 x: 0,
//                 y: 0
//             }
//         }
//     },
//     scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH
//     },
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);

function preload() {
	this.load.image("red-pusher", "../img/hockey/red-pusher.png");
	this.load.image("blue-pusher", "../img/hockey/blue-pusher.png");
	this.load.image("background", "../img/hockey/background.jpg");
	this.load.image("puck", "../img/hockey/puck.png");
	this.load.image("test", "../img/test.png");

	const physics = this.physics;

	let framerate = 60;
	setTimeout(async () => {
		framerate = closestNumberInArray(await getFPS(), usualRefreshRates);
		physics.world.setFPS(framerate);
		console.log("FPS: " + framerate);
	}, 1000);

	this.physics.world.defaults.debugShowBody = true;
	this.physics.world.defaults.bodyDebugColor = 0xff00ff;
	this.physics.world.defaults.debugShowStaticBody = true;
	this.physics.world.defaults.staticBodyDebugColor = 0x0000ff;
	this.physics.world.defaults.debugShowVelocity = true;
	this.physics.world.defaults.velocityDebugColor = 0x00ff00;
}

function create() {
	const background = this.add.image(
		this.cameras.main.width / 2,
		this.cameras.main.height / 2,
		"background"
	);
	background
		.setScale(
			Math.max(
				this.cameras.main.width / background.width,
				this.cameras.main.height / background.height
			)
		)
		.setScrollFactor(0);

	state.gameElements.scoreText = this.add
		.text(
			this.cameras.main.worldView.x + this.cameras.main.width / 2,
			48,
			"0 : 0"
		)
		.setOrigin(0.5)
		.setFontFamily("Arial")
		.setFontSize(64)
		.setColor("#000000");

	state.gameElements.goals[0] = this.add.rectangle(
		0,
		config.height / 2,
		10,
		160 * config.goalSize,
		0x990000,
		0
	);

	state.gameElements.goals[1] = this.add.rectangle(
		config.width,
		config.height / 2,
		10,
		160 * config.goalSize,
		0x990000,
		0
	);

	state.gameElements.pushers[0] = this.physics.add.image(
		0,
		config.height / 2,
		"red-pusher"
	);
	state.gameElements.pushers[0]
		.setOrigin(3.5 * config.pusherSize, 0.5)
		.setCircle(state.gameElements.pushers[0].width / 2)
		.setScale(0.3 * config.pusherSize)
		.setBounce(1)
		.setCollideWorldBounds(true)
		.setMass(3);

	state.gameElements.pushers[1] = this.physics.add.image(
		config.width,
		config.height / 2,
		"blue-pusher"
	);
	state.gameElements.pushers[1]
		.setOrigin(-3.5 * config.pusherSize + config.pusherSize, 0.5)
		.setCircle(state.gameElements.pushers[1].width / 2)
		.setScale(0.3 * config.pusherSize)
		.setBounce(1)
		.setCollideWorldBounds(true)
		.setMass(3);

	state.gameElements.puck = this.physics.add.image(
		config.width / 2,
		config.height / 2,
		"puck"
	);
	state.gameElements.puck
		.setCircle(state.gameElements.puck.width / 2)
		.setScale(0.125 * config.puckSize)
		.setBounce(1)
		.setCollideWorldBounds(true)
		.setMass(2);
	state.gameElements.puck.body.onWorldBounds = true;
	state.gameElements.puck.body.onCollide = true;

	this.physics.add.collider(
		state.gameElements.pushers[0],
		state.gameElements.puck
	);
	this.physics.add.collider(
		state.gameElements.pushers[1],
		state.gameElements.puck
	);

	this.physics.add.collider(
		state.gameElements.pushers[0],
		state.gameElements.pushers[1]
	);

	this.physics.add.existing(state.gameElements.goals[0]);
	this.physics.add.existing(state.gameElements.goals[1]);

	state.gameElements.puck.body.world.on("worldbounds", () => {
		collidePlaybackWall();
	});

	state.gameElements.puck.body.world.on("collide", () => {
		collidePlayback();
		// console.log(event);
		// event.body.rotation += 1;
	});

	resetPositions();
}

function update() {
	let tmpBounds;
	tmpBounds = state.gameElements.goals[0].getBounds();
	if (
		this.physics
			.overlapRect(
				tmpBounds.x,
				tmpBounds.y,
				tmpBounds.width,
				tmpBounds.height
			)
			.map((el) => {
				return el.mass === 2;
			})
			.some((el) => {
				return el === true;
			})
	) {
		updateScore(1);
	}

	tmpBounds = state.gameElements.goals[1].getBounds();
	if (
		this.physics
			.overlapRect(
				tmpBounds.x,
				tmpBounds.y,
				tmpBounds.width,
				tmpBounds.height
			)
			.map((el) => {
				return el.mass === 2;
			})
			.some((el) => {
				return el === true;
			})
	) {
		updateScore(0);
	}

	for (const gamepad of navigator
		.getGamepads()
		.filter((gamepad) => {
			if (!gamepad) return;
			return state.gamepads.some((el) => el.index === gamepad.index);
		})
		.values()) {
		// for (const [axisIndex, axis] of gamepad.axes.entries()) {
		// $("#" + gamepad.index + "-" + standartLayout[axisIndex]).val(axis * 0.5 + 0.5);
		// }
		const axis = gamepad.axes;
		state.gameElements.pushers[gamepad.index - Math.min(...state.gamepads)].setVelocity(
			axis[0] * 1000 * config.moveSpeed +
				axis[2] * 1000 * config.moveSpeed * config.controlsAsymmetry,
			axis[1] * 1000 * config.moveSpeed +
				axis[3] * 1000 * config.moveSpeed * config.controlsAsymmetry
		);

		switch (gamepad.index) {
			case 0:
				if (
					state.gameElements.pushers[0].body.x >
					(config.width * 65) / 100
				) {
					state.gameElements.pushers[0].body.x =
						(config.width * 65) / 100;
				}
				break;
			case 1:
				if (
					state.gameElements.pushers[1].body.x <
					(config.width * 35) / 100 -
						state.gameElements.pushers[0].body.width
				) {
					state.gameElements.pushers[1].body.x =
						(config.width * 35) / 100 -
						state.gameElements.pushers[0].body.width;
				}
				break;
		}
	}
}

function updateScore(playerIndex) {
	state.score[playerIndex]++;
	state.gameElements.scoreText.setText(
		state.score[0] + " : " + state.score[1]
	);
	resetPositions();
	vibrateGamepads();
}

window.addEventListener("gamepadconnected", (event) => {
	console.warn("Gamepad connected from index " + event.gamepad.index);
	state.gamepads.push(event.gamepad);
	// for (const [indexAxes, axis] of event.gamepad.axes.entries()) {
	// $("#GamepadValues").append("<progress id=" + (state.gamepads.length - 1) + "-" + standartLayout[indexAxes] + " value=" + (axis * 0.5 + 0.5) + "></progress>");
	// }
});

window.addEventListener("gamepaddisconnected", (event) => {
	console.warn("Gamepad disconnected from index " + event.gamepad.index);
	state.gamepads = state.gamepads.filter(
		(gamepad) => gamepad.index !== event.gamepad.index
	);
	// for (const indexAxes of event.gamepad.axes.keys()) {
	// $("#" + event.gamepad.index + "-" + standartLayout[indexAxes]).remove();
	// }
});

window.addEventListener("resize", () => {
	location.reload();
});
