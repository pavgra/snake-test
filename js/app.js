"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
			}var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, f, f.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		var GameEngine = require('Engines/GameEngine'),
		    RenderEngine = require('Engines/RenderEngine');

		var CONTAINER_EL_SELECTOR = '.js-grid',
		    GRID_SIZE_CELLS = 30,
		    GRID_SIZE_PX = 600;

		var gameEngine = new GameEngine(10, GRID_SIZE_CELLS),
		    renderEngine = new RenderEngine(document.querySelector(CONTAINER_EL_SELECTOR), GRID_SIZE_CELLS, GRID_SIZE_PX);

		function runGame() {
			gameEngine.run(function () {
				var gameObjects = gameEngine.getObjects();
				renderEngine.drawObjects(gameObjects);
			}, function () {
				if (window.confirm("Game over! Your score: " + gameEngine.score + ". Would you like to start new game?")) runGame();
			});
		}

		renderEngine.drawGrid();
		runGame();

		// For debugging
		window.Point = require('Utilities/Point');
		window.gameEngine = gameEngine;
		window.renderEngine = renderEngine;
	}, { "Engines/GameEngine": 2, "Engines/RenderEngine": 3, "Utilities/Point": 8 }], 2: [function (require, module, exports) {
		var Point = require('Utilities/Point'),
		    Helpers = require('Utilities/Helpers'),
		    Food = require('Entities/Food'),
		    Snake = require('Entities/Snake');

		var GameEngine = function () {
			function GameEngine(fps, gridSize) {
				_classCallCheck(this, GameEngine);

				this.fps = fps; // Frames-per-second
				this.gridSize = gridSize;
				this.initKeyListeners();
			}

			/**
    * Initializes listeners for key pressing
    */


			_createClass(GameEngine, [{
				key: "initKeyListeners",
				value: function initKeyListeners() {
					var _this = this;

					var keys = {
						// up
						38: function _() {
							return _this.snake.turnUp();
						},
						// down
						40: function _() {
							return _this.snake.turnDown();
						},
						// left
						37: function _() {
							return _this.snake.turnLeft();
						},
						// right
						39: function _() {
							return _this.snake.turnRight();
						}
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

			}, {
				key: "placeFood",
				value: function placeFood() {
					this.food.location = new Point(Helpers.getRandomInt(0, this.gridSize - 1), Helpers.getRandomInt(0, this.gridSize - 1));
				}

				/**
     * Checks if snake has eaten food and needs to be grown
     * @return {boolean}
     */

			}, {
				key: "checkFood",
				value: function checkFood() {
					return this.snake.head.toString() == this.food.location.toString();
				}

				/**
     * Proceeds game loop
     */

			}, {
				key: "loop",
				value: function loop() {
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
			}, {
				key: "startNewGame",
				value: function startNewGame() {
					this.score = 0;
					this.isGameOver = false;
					this.snake = new Snake(0, 0, 5, undefined, '#00FF00', 30, 30);
					this.food = new Food();
					this.placeFood();
				}

				/**
     * Run game cycle
     * @param  {function} successCb  Callback after each not-final loop
     * @param  {function} gameOverCb Callback after game over
     */

			}, {
				key: "run",
				value: function run(successCb, gameOverCb) {
					var _this2 = this;

					this.startNewGame();

					var interval = setInterval(function () {
						_this2.loop();

						if (_this2.isGameOver) {
							clearInterval(interval);
							gameOverCb();
						} else {
							successCb();
						}
					}, 1000 / this.fps);
				}

				/**
     * Return list of game entities for later painting
     * @return {array}
     */

			}, {
				key: "getObjects",
				value: function getObjects() {
					return [this.snake, this.food];
				}
			}]);

			return GameEngine;
		}();

		module.exports = GameEngine;
	}, { "Entities/Food": 5, "Entities/Snake": 6, "Utilities/Helpers": 7, "Utilities/Point": 8 }], 3: [function (require, module, exports) {
		var RenderEngine = function () {
			function RenderEngine(el, gridCellsCnt, gridSizePx) {
				_classCallCheck(this, RenderEngine);

				this.el = el;
				this.gridCellsCnt = gridCellsCnt;
				this.gridSizePx = gridSizePx;
			}

			_createClass(RenderEngine, [{
				key: "drawGrid",
				value: function drawGrid() {
					var html = '';

					for (var i = 0; i < this.gridCellsCnt; i++) {
						html += '<tr>';
						for (var j = 0; j < this.gridCellsCnt; j++) {
							html += "<td id=\"grid-cell-" + i + "-" + j + "\"></td>";
						}
						html += '</tr>';
					}
					html = "<table border=\"1\" width=\"" + this.gridSizePx + "\" height=\"" + this.gridSizePx + "\">" + html + '</table>';

					this.el.innerHTML = html;
				}
			}, {
				key: "clearObjects",
				value: function clearObjects() {
					var cells = document.querySelectorAll('[id^=grid-cell]');
					for (var i = 0; i < cells.length; i++) {
						cells[i].style.background = 'white';
					}
				}
			}, {
				key: "drawObjects",
				value: function drawObjects(objects) {
					var object, point, cell;

					this.clearObjects();

					for (var i = 0; i < objects.length; i++) {
						object = objects[i];
						for (var j = 0; j < object.points.length; j++) {
							point = object.points[j];
							cell = document.querySelector("#grid-cell-" + point.y + "-" + point.x);
							cell.style.background = object.color;
						}
					}
				}
			}]);

			return RenderEngine;
		}();

		module.exports = RenderEngine;
	}, {}], 4: [function (require, module, exports) {
		var Point = require('Utilities/Point');

		var hexColorRegex = '^#[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}$';

		/**
   * Base class representing game entity
   */

		var Entity =
		/**
   * @param  {Point|array} points One point or list of points representing the entity
   * @param  {string} color  Color of the entity in HEX format with leading '#'
   */
		function Entity(points, color) {
			_classCallCheck(this, Entity);

			// this.points
			if (typeof points !== 'undefined' && points instanceof Point) this.points = [points];else if (typeof points !== 'undefined' && points instanceof Array) this.points = points;else throw new Exception('Points should be an instance of Point or an array of Points!');

			// this.color
			if (typeof color === 'string' || color.match(hexColorRegex)) this.color = color;else throw new Exception('Color should be a hex value!');
		};

		module.exports = Entity;
	}, { "Utilities/Point": 8 }], 5: [function (require, module, exports) {
		var Point = require('Utilities/Point'),
		    Entity = require('Entities/Entity');

		var Food = function (_Entity) {
			_inherits(Food, _Entity);

			function Food() {
				var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
				var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
				var color = arguments.length <= 2 || arguments[2] === undefined ? '#FF0000' : arguments[2];

				_classCallCheck(this, Food);

				return _possibleConstructorReturn(this, Object.getPrototypeOf(Food).call(this, new Point(x, y), color));
			}

			/**
    * Returns location of the food
    * @return {Point}
    */


			_createClass(Food, [{
				key: "location",
				get: function get() {
					return this.points[0];
				},
				set: function set(point) {
					this.points[0] = point;
				}
			}]);

			return Food;
		}(Entity);

		module.exports = Food;
	}, { "Entities/Entity": 4, "Utilities/Point": 8 }], 6: [function (require, module, exports) {
		var Point = require('Utilities/Point'),
		    Entity = require('Entities/Entity');

		var DIRECTION = {
			LEFT: 'left',
			RIGHT: 'right',
			TOP: 'top',
			BOTTOM: 'bottom'
		};

		var Snake = function (_Entity2) {
			_inherits(Snake, _Entity2);

			function Snake() {
				var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
				var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
				var length = arguments.length <= 2 || arguments[2] === undefined ? 5 : arguments[2];
				var direction = arguments.length <= 3 || arguments[3] === undefined ? DIRECTION.RIGHT : arguments[3];
				var color = arguments.length <= 4 || arguments[4] === undefined ? '#00FF00' : arguments[4];
				var maxX = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
				var maxY = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

				_classCallCheck(this, Snake);

				var points = Snake.buildPoints(x, y, length, direction);

				var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Snake).call(this, points, color));

				_this4.direction = direction;

				_this4.maxX = maxX;
				_this4.maxY = maxY;
				return _this4;
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


			_createClass(Snake, [{
				key: "hasClosure",


				/**
     * Checks whether snake is overlapping itself
     * @return {Boolean} [description]
     */
				value: function hasClosure() {
					var headStr = this.head.toString();
					for (var i = 0; i < this.points.length - 1; i++) {
						if (this.points[i].toString() === headStr) return true;
					}
					return false;
				}

				// Change direction of snake

			}, {
				key: "turnLeft",
				value: function turnLeft() {
					if (this.direction !== DIRECTION.RIGHT) this.direction = DIRECTION.LEFT;
				}
			}, {
				key: "turnRight",
				value: function turnRight() {
					if (this.direction !== DIRECTION.LEFT) this.direction = DIRECTION.RIGHT;
				}
			}, {
				key: "turnUp",
				value: function turnUp() {
					if (this.direction !== DIRECTION.BOTTOM) this.direction = DIRECTION.TOP;
				}
			}, {
				key: "turnDown",
				value: function turnDown() {
					if (this.direction !== DIRECTION.TOP) this.direction = DIRECTION.BOTTOM;
				}

				/**
     * Move snake to new position in accordance to its direction
     * @param {boolean} grow Shows whether snake's ending point should be saved or not
     */

			}, {
				key: "move",
				value: function move() {
					var grow = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

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

					if (this.maxX > 0) newHead.x = newHead.x < 0 ? this.maxX + newHead.x : newHead.x % this.maxX;

					if (this.maxY > 0) newHead.y = newHead.y < 0 ? this.maxY + newHead.y : newHead.y % this.maxY;

					this.points.push(newHead);
					if (!grow) this.points.shift();
				}
			}, {
				key: "head",


				/**
     * Returns head point of the snake
     * @return {Point}
     */
				get: function get() {
					return this.points[this.points.length - 1];
				}
			}], [{
				key: "buildPoints",
				value: function buildPoints(x, y, length, direction) {
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
					if (direction == DIRECTION.LEFT || direction == DIRECTION.TOP) points = points.reverse();

					return points;
				}
			}]);

			return Snake;
		}(Entity);

		module.exports = Snake;
	}, { "Entities/Entity": 4, "Utilities/Point": 8 }], 7: [function (require, module, exports) {
		var Helpers = function () {
			function Helpers() {
				_classCallCheck(this, Helpers);
			}

			_createClass(Helpers, null, [{
				key: "getRandomInt",
				value: function getRandomInt(min, max) {
					return Math.floor(Math.random() * (max - min)) + min;
				}
			}]);

			return Helpers;
		}();

		module.exports = Helpers;
	}, {}], 8: [function (require, module, exports) {
		/**
   * Simple geometry entity
   */
		var Point = function () {
			function Point() {
				var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
				var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

				_classCallCheck(this, Point);

				this.x = x;
				this.y = y;
			}

			_createClass(Point, [{
				key: "toString",
				value: function toString() {
					return this.x + ',' + this.y;
				}
			}]);

			return Point;
		}();

		module.exports = Point;
	}, {}] }, {}, [1]);