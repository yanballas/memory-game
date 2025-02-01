import background from '/sprites/background.png';
import cardFront from '/sprites/card-front.png';

export class GameScene extends Phaser.Scene {
	#config = {}
	constructor(config) {
		super("Game");
		this.#config = config;
	}
	preload() {
		this.load.image('background', background)
		this.load.image('card-front', cardFront)
	}
	create() {
		this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background') // x: 0, y:0 = left\top
		// также можно использовать метод класса scene setOrigin строя chain вызовов
		// this.add.sprite(0, 0, 'background').setOrigin(0, 0)
		const currentPositions = this.cardPositions
		currentPositions.forEach(position => {
			this.add.sprite(position.x, position.y, 'card-front').setOrigin(0, 0);
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