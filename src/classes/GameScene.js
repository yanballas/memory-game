import {Card} from "./Card.js";

import background from '/sprites/background.png';
import cardFront from '/sprites/card-front.png';
import cardEmpty from '/sprites/card-empty.jpg';

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
	#levelOutText = {}
	#scoreOutText = {}
	#timer = {}
	#counterTimer = 0
	#sounds = {}
	#level = 0
	#isWin = false
	#score = 0
	#cardsSeries = 0
	
	constructor(config) {
		super("Game");
		this.#config = config;
	}
	preload() {
		this.load.image('background', background)
		this.load.image('card-front', cardFront)
		this.load.image('card-empty', cardEmpty)
		
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
			fill: '#fefe22'
		})
		this.#levelOutText = this.add.text(this.sys.game.config.width / 2 - 48, 10, `Level: ${this.#level+1}`, {
			font: '48px Century-Gothic',
			fill: '#fefe22',
		})
		this.#scoreOutText = this.add.text(10, 240, `Score: ${this.#score}`, {
			font: '24px Century-Gothic',
			fill: '#fefe22',
		})
		this.#timeOutText.setDepth(999)
		this.#levelOutText.setDepth(999)
		this.#scoreOutText.setDepth(999)
	}
	createCard() {
		const pushedCards = (arr) => {
			arr.forEach((cardName) => {
				for (let i = 0; i < 2; i++) {
					this.#cards.push(new Card(this, cardName));
				}
			})
		}
		
		this.#cards.length = 0
		const emptyCards = Array.from({length: this.#config.cardsCounters.filter(card => !this.#config.levels[this.#level].currentCardsCounters.includes(card)).length}, () => 'card-empty')
		if (emptyCards.length !== this.#config.levels[this.#level].currentCardsCounters.length) {
			pushedCards(emptyCards)
		}
		pushedCards(this.#config.levels[this.#level].currentCardsCounters)
		this.input.on("gameobjectdown", this.onCardClick, this)
	}
	onTimerTick() {
		this.#counterTimer--
		if (this.#counterTimer <= 0) {
			this.#timer.paused = true;
			this.#sounds.timeout.play();
			this.restart();
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
	updateScore(seriesNumber) {
		if (!seriesNumber) return
		switch (seriesNumber) {
			case 1: {
				this.#score += 100;
				break;
			}
			case 2: {
				this.#score += 250;
				break;
			}
			case 3: {
				this.#score += 500;
				break;
			}
			case 4: {
				this.#score += 1000;
				break;
			}
			case 5: {
				this.#score += 5000;
				break;
			}
		}
		this.#scoreOutText.setText(`Score: ${this.#score}`)
	}
	onCardClick(pointer, card) {
		if (card.isOpened) return // карта открыта
		
		this.#sounds.card.play()
		if (this.#openedCard) {
			// уже есть открытая карта
			if (this.#openedCard.cardName === card.cardName && card.cardName !== 'card-empty') {
				// карты равны - запомнить
				this.#sounds.complete.play()
				this.#openedCard = null;
				this.#openedCardsCount++;
				this.#cardsSeries++
			} else {
				// карты разные, скрыть прошлую
				this.#openedCard.toggleCard('close')
				this.#cardsSeries = 0
				this.#openedCard = card;
			}
			this.updateScore(this.#cardsSeries)
		} else this.#openedCard = card; // еще нет открытой карты
		const callbackOpen = () => {
			if (this.#openedCardsCount === this.#config.levels[this.#level].currentCardsCounters.length) {
				this.#sounds.success.play()
				this.#isWin = true
				return this.restart()
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
			if (count >= this.#cards.length) {
				if (!this.#isWin) {
					this.#level = 0;
				} else {
						this.#level += 1;
				}
				this.createCard()
				this.start('restart')
			};
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
		this.#counterTimer = this.#config.levels[this.#level].counterTimer;
		this.#timer.paused = false;
		this.#isWin = false
		this.#sounds.theme.play({
			volume: 0.05
		})
		this.#levelOutText.setText(`Level: ${this.#level+1}`)
		this.initialCards(action);
		this.visibilityCards()
	}
	initialCards(action = 'start') {
		const currentPositions = this.cardPositions
		this.#cards.forEach(card => {
			card.initial(currentPositions.pop(), action)
		});
	}
	visibilityCards() {
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