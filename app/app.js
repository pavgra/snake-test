var GameEngine = require('Engines/GameEngine'),
	RenderEngine = require('Engines/RenderEngine');

var CONTAINER_EL_SELECTOR = '.js-grid',
	GRID_SIZE_CELLS = 30,
	GRID_SIZE_PX = 600;

var gameEngine = new GameEngine(10, GRID_SIZE_CELLS),
	renderEngine = new RenderEngine(document.querySelector(CONTAINER_EL_SELECTOR), GRID_SIZE_CELLS, GRID_SIZE_PX);

function runGame() {
	gameEngine
		.run(
			() => {
				var gameObjects = gameEngine.getObjects();
				renderEngine.drawObjects(gameObjects);
			},
			() => {
				if (window.confirm(`Game over! Your score: ${gameEngine.score}. Would you like to start new game?`))
					runGame();
			}
		);
}

renderEngine.drawGrid();
runGame();

// For debugging
window.Point = require('Utilities/Point');
window.gameEngine = gameEngine;
window.renderEngine = renderEngine;