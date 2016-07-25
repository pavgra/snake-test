var Point = require('Utilities/Point'),
	Helpers = require('Utilities/Helpers'),
	Food = require('Entities/Food'),
	Snake = require('Entities/Snake');

class GameEngine {
	constructor(fps, gridSize) {
		this.fps = fps; // Frames-per-second
		this.gridSize = gridSize;
		this.initKeyListeners();
	}

	/**
	 * Initializes listeners for key pressing
	 */
	initKeyListeners() {
		var keys = {
			// up
			38: () => this.snake.turnUp(),
			// down
			40: () => this.snake.turnDown(),
			// left
			37: () => this.snake.turnLeft(),
			// right
			39: () => this.snake.turnRight()
		};

		addEventListener('keydown', function (e) {
			var fu = keys[e.keyCode];
			fu && fu();
		});
	}

	/**
	 * Changes location of food
	 * TODO: can never be in the same place as the snake's body
	 */
	placeFood() {
		this.food.location = new Point(
			Helpers.getRandomInt(0, this.gridSize-1),
			Helpers.getRandomInt(0, this.gridSize-1)
		);
	}

	/**
	 * Checks if snake has eaten food and needs to be grown
	 * @return {boolean}
	 */
	checkFood() {
		return this.snake.head.toString() == this.food.location.toString();
	}

	/**
	 * Proceeds game loop
	 */
	loop() {
		var hasEatenItself = this.snake.hasClosure(),
			hasEatenFood = this.checkFood();

		if (hasEatenItself) {
			this.isGameOver = true;
		}

		if (hasEatenFood) {
			this.score++;
			this.placeFood();
		}

		this.snake.move(hasEatenFood);
	}

	startNewGame() {
		this.score = 0;
		this.isGameOver = false;
		this.snake = new Snake(0, 0, 5, undefined, '#00FF00', this.gridSize, this.gridSize);
		this.food = new Food();
		this.placeFood();
	}

	/**
	 * Run game cycle
	 * @param  {function} successCb  Callback after each not-final loop
	 * @param  {function} gameOverCb Callback after game over
	 */
	run(successCb, gameOverCb) {
		this.startNewGame();

		var interval = setInterval(
			() => {
				this.loop();

				if (this.isGameOver) {
					clearInterval(interval);
					gameOverCb();
				} else {
					successCb()
				}
			},
			1000/this.fps
		);
	}

	/**
	 * Return list of game entities for later painting
	 * @return {array}
	 */
	getObjects() {
		return [this.snake, this.food];
	}
}

module.exports = GameEngine;