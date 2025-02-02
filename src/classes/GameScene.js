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
	#openedCard = null
	#openedCardsCount = 0
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
		this.#config.cardsCounters.forEach((cardCount) => {
			for (let y = 0; y < 2; y++) {
				this.#cards.push(new Card(this, cardCount));
			}
		})
		this.input.on("gameobjectdown", this.onCardClick, this)
	}
	onCardClick(pointer, card) {
		if (card.isOpened) return // карта открыта
		if (this.#openedCard) {
			// уже есть открытая карта
			if (this.#openedCard.cardCount === card.cardCount) {
				// карты равны - запомнить
				this.#openedCard = null;
				this.#openedCardsCount++;
			} else {
				// карты разные, скрыть прошлую
				this.#openedCard.toggleCard('close')
				this.#openedCard = card;
			}
		} else this.#openedCard = card; // еще нет открытой карты
		card.toggleCard('open') // тогглер для отображения
		if (this.#openedCardsCount === this.#config.cardsCounters.length) return this.restart("restart") // перезапуск игры
	}
	create() {
		this.createBackground();
		this.createCard();
		this.restart();
	}
	restart(action) {
		this.#openedCard = null;
		this.#openedCardsCount = 0;
		this.initialCards(action);
	}
	initialCards(action = 'start') {
		const currentPositions = this.cardPositions
		this.#cards.forEach(card => {
			const position = currentPositions.pop()
			if (action === 'restart') card.toggleCard('close')
			card.setPosition(position.x, position.y)
		});
	}
	get cardPositions() {
		const positions = [];
		const cardTexture = this.textures.get("card-front").getSourceImage()
		const cardSizes = {
			width: cardTexture.width + this.#config.gap,
			height: cardTexture.height + this.#config.gap,
		}
		const offset = {
			x: (this.sys.game.config.width - cardSizes.width * this.#config.cols) / 2 + cardSizes.width / 2,
			y: (this.sys.game.config.height - cardSizes.height * this.#config.rows) / 2 + cardSizes.height / 2,
		}
		for (let row = 0; row < this.#config.rows; row++) {
			for (let col = 0; col < this.#config.cols; col++) {
				positions.push({ x: offset.x + col * cardSizes.width, y: offset.y + row * cardSizes.height });
			}
		}
		return Phaser.Utils.Array.Shuffle(positions)
	}
}