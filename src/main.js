import './style.css';
import Phaser from 'phaser';
import {GameScene} from "./classes/GameScene.js";

document.addEventListener('DOMContentLoaded', () => {
	const sceneConfig = {
		width: 1280,
		height: 720,
		cards: [1, 2, 3, 4, 5],
		rows: 2,
		cols: 5,
		gap: 4,
	}
	const gameConfig = {
		...sceneConfig,
		type: Phaser.AUTO, // webgl or canvas
		scene: new GameScene(sceneConfig),
	};
	const game = new Phaser.Game(gameConfig);
})