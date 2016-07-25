var Point = require('Utilities/Point'),
	Entity = require('Entities/Entity');

var DIRECTION = {
	LEFT: 'left',
	RIGHT: 'right',
	TOP: 'top',
	BOTTOM: 'bottom'
}

class Snake extends Entity {

	constructor(x = 0, y = 0, length = 5, direction = DIRECTION.RIGHT, color = '#00FF00', maxX = 0, maxY = 0) {
		var points = Snake.buildPoints(x, y, length, direction);
		super(points, color);
		this.direction = direction;

		this.maxX = maxX;
		this.maxY = maxY;
	}

	/**
	 * Builds array of points representing snake's body 
	 * by coordinates of its start, snake's direction and length
	 * @param  {integer} x         X coordinate of snake's head
	 * @param  {integer} y         Y coordinate of snake's head
	 * @param  {integer} length    Length of snake
	 * @param  {string} direction  Direction of snake
	 * @return {array}
	 */
	static buildPoints(x, y, length, direction) {
		var points = [];

		for (var i = 0; i < length; i++) {
			switch (direction) {
				case DIRECTION.LEFT:
				case DIRECTION.RIGHT:
					points.push(new Point(x + i, y));
					break;
				case DIRECTION.TOP:
				case DIRECTION.BOTTOM:
					points.push(new Point(x, y + i));
					break;
			}
		}
		if (direction == DIRECTION.LEFT || direction == DIRECTION.TOP)
			points = points.reverse();

		return points;
	}

	/**
	 * Returns head point of the snake
	 * @return {Point}
	 */
	get head() {
		return this.points[this.points.length - 1];
	}

	/**
	 * Checks whether snake is overlapping itself
	 * @return {Boolean} [description]
	 */
	hasClosure() {
		var headStr = this.head.toString();
		for (var i = 0; i < this.points.length - 1; i++) {
			if (this.points[i].toString() === headStr)
				return true;
		}
		return false;
	}

	// Change direction of snake

	turnLeft() {
		if (this.direction !== DIRECTION.RIGHT)
			this.direction = DIRECTION.LEFT;
	}

	turnRight() {
		if (this.direction !== DIRECTION.LEFT)
			this.direction = DIRECTION.RIGHT;
	}

	turnUp() {
		if (this.direction !== DIRECTION.BOTTOM)
			this.direction = DIRECTION.TOP;
	}

	turnDown() {
		if (this.direction !== DIRECTION.TOP)
			this.direction = DIRECTION.BOTTOM;
	}

	/**
	 * Move snake to new position in accordance to its direction
	 * @param {boolean} grow Shows whether snake's ending point should be saved or not
	 */
	move(grow = false) {
		var newHead = new Point(this.head.x, this.head.y);

		switch (this.direction) {
			case DIRECTION.LEFT:
				newHead.x -= 1;
				break;
			case DIRECTION.RIGHT:
				newHead.x += 1;
				break;
			case DIRECTION.TOP:
				newHead.y -= 1;
				break;
			case DIRECTION.BOTTOM:
				newHead.y += 1;
				break;
		}

		// NOTE: probably not the best solution. May be move out to GameEngine
		if (this.maxX > 0)
			newHead.x = newHead.x < 0 ? (this.maxX + newHead.x) : newHead.x % this.maxX;
		if (this.maxY > 0)
			newHead.y = newHead.y < 0 ? (this.maxY + newHead.y) : newHead.y % this.maxY;

		this.points.push(newHead);
		if (!grow)
			this.points.shift();
	}
}

module.exports = Snake;