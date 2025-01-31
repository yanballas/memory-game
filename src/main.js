import './style.css';
import Phaser from 'phaser';

import background from '/sprites/background.png';

document.addEventListener('DOMContentLoaded', () => {
	const scene = new Phaser.Scene("memory-game"); // window for game

	scene.preload = function () {
		this.load.image('background', background)
	};

	scene.create = function () {
		this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background') // x: 0, y:0 = left\top
		// также можно использовать метод класса scene setOrigin строя chain вызовов
		// this.add.sprite(0, 0, 'background').setOrigin(0, 0)
	};

	const config = {
		type: Phaser.AUTO, // webgl or canvas
		width: 1280,
		height: 720,
		scene: scene,
	};

	const game = new Phaser.Game(config);
})