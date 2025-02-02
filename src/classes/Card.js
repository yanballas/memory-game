export class Card extends Phaser.GameObjects.Sprite {
	#scene;
	#cardCount;
	#isOpened;
	constructor(scene, cardCount) {
		super(scene, 0, 0, 'card-front');
		this.#scene = scene;
		this.#cardCount = cardCount;
		// this.setOrigin(0.5, 0.5)
		this.#scene.add.existing(this);
		this.#isOpened = false
		this.setInteractive();
		// this.on('pointerdown', this.#openCard, this)
	}
	
	hideCard(texture) {
		this.#scene.tweens.add({
			targets: this,
			scaleX: 0,
			ease: 'power2.out',
			duration: 300,
			onComplete: () => {
				this.showCard(texture)
			}
		})
	}
	
	showCard(texture) {
		this.setTexture(texture)
		this.#scene.tweens.add({
			targets: this,
			scaleX: 1,
			ease: 'power2.out',
			duration: 300,
		})
	}
	
	toggleCard(action) {
		switch (action) {
			case 'open': {
				this.#isOpened = true;
				this.hideCard(`card-back${this.#cardCount}`);
				break;
			}
			case 'close': {
				this.#isOpened = false;
				this.hideCard('card-front');
				break;
			}
		}
	}
	
	get cardCount() {
		return this.#cardCount;
	}
	
	get isOpened() {
		return this.#isOpened;
	}
	
	set isOpened(newValue) {
		this.#isOpened = newValue;
	}
}