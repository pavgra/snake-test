var Point = require('Utilities/Point'),
	Entity = require('Entities/Entity');

class Food extends Entity {
	constructor(x = 0, y = 0, color = '#FF0000') {
		super(new Point(x, y), color);
	}

	/**
	 * Returns location of the food
	 * @return {Point}
	 */
	get location() {
		return this.points[0];
	}

	set location(point) {
		this.points[0] = point;
	}
}

module.exports = Food;