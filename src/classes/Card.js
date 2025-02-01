export class Card extends Phaser.GameObjects.Sprite {
	#scene;
	#card;
	constructor(scene, card, position) {
		super(scene, position.x, position.y, 'card-front');
		this.#scene = scene;
		this.#card = card;
		this.setOrigin(0, 0)
		this.#scene.add.existing(this);
		
		this.setInteractive();
		// this.on('pointerdown', this.#openCard, this)
	}
	
	openCard() {
		this.setTexture(`card-back${this.#card}`)
	}
}