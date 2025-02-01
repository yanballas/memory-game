import {Card} from "./Card.js";

import background from '/sprites/background.png';
import cardFront from '/sprites/card-front.png';

import cardBack1 from '/sprites/card-back1.png';
import cardBack2 from '/sprites/card-back2.png';
import cardBack3 from '/sprites/card-back3.png';
import cardBack4 from '/sprites/card-back4.png';
import cardBack5 from '/sprites/card-back5.png';

export class GameScene extends Phaser.Scene {
	#config = {}
	#cards = []
	constructor(config) {
		super("Game");
		this.#config = config;
	}
	preload() {
		this.load.image('background', background)
		this.load.image('card-front', cardFront)
		
		this.load.image('card-back1', cardBack1)
		this.load.image('card-back2', cardBack2)
		this.load.image('card-back3', cardBack3)
		this.load.image('card-back4', cardBack4)
		this.load.image('card-back5', cardBack5)
	}
	createBackground() {
		this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background') // x: 0, y:0 = left\top
		// также можно использовать метод класса scene setOrigin строя chain вызовов
		// this.add.sprite(0, 0, 'background').setOrigin(0, 0)
	}
	createCard() {
		const currentPositions = this.cardPositions
		Phaser.Utils.Array.Shuffle(currentPositions)
		this.#config.cards.forEach((card) => {
			for (let y = 0; y < 2; y++) {
				this.#cards.push(new Card(this, card, currentPositions.pop()));
			}
		})
		this.input.on("gameobjectdown", this.onCardClick, this)
	}
	onCardClick(pointer, card) {
		card.openCard()
	}
	create() {
		this.createBackground();
		this.createCard();
	}
	get cardPositions() {
		const positions = [];
		const cardTexture = this.textures.get("card-front").getSourceImage()
		const cardSizes = {
			width: cardTexture.width + this.#config.gap,
			height: cardTexture.height + this.#config.gap,
		}
		const offset = {
			x: (this.sys.game.config.width - cardSizes.width * this.#config.cols) / 2,
			y: (this.sys.game.config.height - cardSizes.height * this.#config.rows) / 2,
		}
		for (let row = 0; row < this.#config.rows; row++) {
			for (let col = 0; col < this.#config.cols; col++) {
				positions.push({ x: offset.x + col * cardSizes.width, y: offset.y + row * cardSizes.height });
			}
		}
		return positions
	}
}