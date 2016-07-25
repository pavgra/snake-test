var Point = require('Utilities/Point');

var hexColorRegex = '^#[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}$';

/**
 * Base class representing game entity
 */
class Entity {
	/**
	 * @param  {Point|array} points One point or list of points representing the entity
	 * @param  {string} color  Color of the entity in HEX format with leading '#'
	 */
	constructor(points, color) {
		// this.points
		if (typeof points !== 'undefined' && points instanceof Point)
			this.points = [points];
		else if (typeof points !== 'undefined' && points instanceof Array)
			this.points = points;
		else
			throw new Exception('Points should be an instance of Point or an array of Points!');

		// this.color
		if (typeof color === 'string' || color.match(hexColorRegex))
			this.color = color;
		else
			throw new Exception('Color should be a hex value!');
	}
}

module.exports = Entity;