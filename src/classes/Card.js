export class Card extends Phaser.GameObjects.Sprite {
	#scene;
	#cardCount;
	#isOpened;
	#positions;
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
	
	initial(positions, action) {
		this.#positions = positions
		if (action === 'restart') this.toggleCard('close')
		this.setPosition(-this.width, -this.height)
	}
	
	move(positions) {
		this.#scene.tweens.add({
			targets: this,
			x: positions.x,
			y: positions.y,
			ease: 'power2.easeInOut',
			duration: 300,
			delay: positions.delay,
			onComplete: () => {
				if (positions.callback) positions.callback()
			}
		})
	}
	
	hideCard() {
		this.#scene.tweens.add({
			targets: this,
			scaleX: 0,
			ease: 'power2.out',
			duration: 300,
			onComplete: () => {
				this.showCard()
			}
		})
	}
	
	showCard() {
		const texture = this.#isOpened ? `card-back${this.#cardCount}` : 'card-front';
		this.setTexture(texture)
		this.#scene.tweens.add({
			targets: this,
			scaleX: 1,
			ease: 'power2.out',
			duration: 300,
		})
	}
	
	toggleCard(action, callback = null) {
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
		if (callback) callback()
	}
	
	get cardCount() {
		return this.#cardCount;
	}
	
	get isOpened() {
		return this.#isOpened;
	}
	
	get positions() {
		return this.#positions;
	}
	
	set isOpened(newValue) {
		this.#isOpened = newValue;
	}
}