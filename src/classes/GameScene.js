import {Card} from "./Card.js";

import background from '/sprites/background.png';
import cardFront from '/sprites/card-front.png';

import cardBack1 from '/sprites/card-back1.png';
import cardBack2 from '/sprites/card-back2.png';
import cardBack3 from '/sprites/card-back3.png';
import cardBack4 from '/sprites/card-back4.png';
import cardBack5 from '/sprites/card-back5.png';

import theme from '/sounds/theme.mp3';
import card from '/sounds/card.mp3';
import complete from '/sounds/complete.mp3';
import success from '/sounds/success.mp3';
import timeout from '/sounds/timeout.mp3';

export class GameScene extends Phaser.Scene {
	#config = {}
	#cards = []
	#openedCard = null
	#openedCardsCount = 0
	#timeOutText = {}
	#timer = {}
	#counterTimer = 0
	#sounds = {}
	constructor(config) {
		super("Game");
		this.#config = config;
		this.#counterTimer = this.#config.counterTimer;
	}
	preload() {
		this.load.image('background', background)
		this.load.image('card-front', cardFront)
		
		this.load.image('card-back1', cardBack1)
		this.load.image('card-back2', cardBack2)
		this.load.image('card-back3', cardBack3)
		this.load.image('card-back4', cardBack4)
		this.load.image('card-back5', cardBack5)
		
		this.load.audio('theme', theme)
		this.load.audio('card', card)
		this.load.audio('complete', complete)
		this.load.audio('success', success)
		this.load.audio('timeout', timeout)
	}
	createBackground() {
		this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background') // x: 0, y:0 = left\top
		// также можно использовать метод класса scene setOrigin строя chain вызовов
		// this.add.sprite(0, 0, 'background').setOrigin(0, 0)
	}
	createText() {
		this.#timeOutText = this.add.text(10, 320, `Time: ${this.#counterTimer}`, {
			font: '24px Century-Gothic',
			fill: 'white'
		})
	}
	createCard() {
		this.#config.cardsCounters.forEach((cardCount) => {
			for (let y = 0; y < 2; y++) {
				this.#cards.push(new Card(this, cardCount));
			}
		})
		this.input.on("gameobjectdown", this.onCardClick, this)
	}
	onTimerTick() {
		this.#counterTimer--
		if (this.#counterTimer <= 0) {
			this.#timer.paused = true;
			this.#sounds.timeout.play();
			this.restart('restart');
		}
		this.#timeOutText.setText(`Time: ${this.#counterTimer}`)
	}
	createTimer() {
		const timerConfig = {
			delay: 1000,
			callback: this.onTimerTick,
			callbackScope: this,
			loop: true
		}
		this.#timer = this.time.addEvent(timerConfig)
	}
	createSounds() {
		this.#sounds = {
			theme: this.sound.add('theme'),
			card: this.sound.add('card'),
			complete: this.sound.add('complete'),
			success: this.sound.add('success'),
			timeout: this.sound.add('timeout')
		}
	}
	onCardClick(pointer, card) {
		if (card.isOpened) return // карта открыта
		this.#sounds.card.play()
		if (this.#openedCard) {
			// уже есть открытая карта
			if (this.#openedCard.cardCount === card.cardCount) {
				// карты равны - запомнить
				this.#sounds.complete.play()
				this.#openedCard = null;
				this.#openedCardsCount++;
			} else {
				// карты разные, скрыть прошлую
				this.#openedCard.toggleCard('close')
				this.#openedCard = card;
			}
		} else this.#openedCard = card; // еще нет открытой карты
		const callbackOpen = () => {
			if (this.#openedCardsCount === this.#config.cardsCounters.length) {
				this.#sounds.success.play()
				return this.restart("restart")
			} // перезапуск игры
		}
		card.toggleCard('open', callbackOpen) // тогглер для отображения
	}
	create() {
		this.createBackground();
		this.createText();
		this.createCard();
		this.createTimer();
		this.createSounds();
		this.start();
	}
	restart() {
		let count = 0;
		const onCardMoveComplete = () => {
			++count;
			if (count >= this.#cards.length) this.start('restart');
		}
		this.#cards.forEach(card => {
			const { delay } = card.positions;
			card.move({
				x: this.sys.game.config.width + card.width,
				y: this.sys.game.config.height + card.height,
				delay: delay,
				callback: onCardMoveComplete
			})
		})
	}
	start(action) {
		this.#openedCard = null;
		this.#openedCardsCount = 0;
		this.#counterTimer = this.#config.counterTimer;
		this.#timer.paused = false;
		this.#sounds.theme.play({
			volume: 0.05
		})
		this.initialCards(action);
		this.showCards()
	}
	initialCards(action = 'start') {
		const currentPositions = this.cardPositions
		this.#cards.forEach(card => {
			card.initial(currentPositions.pop(), action)
		});
	}
	showCards() {
		this.#cards.forEach(card => {
			const { x, y, delay } = card.positions;
			card.depth = delay;
			card.move({
				x: x,
				y: y,
				delay: delay
			})
		})
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
		let id = 0
		for (let row = 0; row < this.#config.rows; row++) {
			for (let col = 0; col < this.#config.cols; col++) {
				positions.push({ x: offset.x + col * cardSizes.width, y: offset.y + row * cardSizes.height, delay: ++id * 100 });
			}
		}
		return Phaser.Utils.Array.Shuffle(positions)
	}
}