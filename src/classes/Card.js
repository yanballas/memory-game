export class Card extends Phaser.GameObjects.Sprite {
	#scene;
	#cardName;
	#isOpened;
	#positions;
	constructor(scene, cardName) {
		super(scene, 0, 0, 'card-front');
		this.#scene = scene;
		this.#cardName = cardName;
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
	
	hideCard(callback) {
		this.#scene.tweens.add({
			targets: this,
			scaleX: 0,
			ease: 'power2.out',
			duration: 300,
			onComplete: () => {
				this.showCard(callback)
			}
		})
	}
	
	showCard(callback) {
		let texture;
		if (this.isOpened) texture = this.#cardName === 'card-empty' ? this.#cardName : `card-back${this.#cardName}`
		else texture = 'card-front'
		this.setTexture(texture)
		this.#scene.tweens.add({
			targets: this,
			scaleX: 1,
			ease: 'power2.out',
			duration: 300,
			onComplete: () => {
				if (callback) callback();
			}
		})
	}
	
	toggleCard(action, callback = null) {
		switch (action) {
			case 'open': {
				this.#isOpened = true;
				this.hideCard(callback);
				break;
			}
			case 'close': {
				this.#isOpened = false;
				this.hideCard(null);
				break;
			}
		}
	}
	
	get cardName() {
		return this.#cardName;
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