class RenderEngine {
	constructor(el, gridCellsCnt, gridSizePx) {
		this.el = el;
		this.gridCellsCnt = gridCellsCnt;
		this.gridSizePx = gridSizePx;
	}

	drawGrid() {
		var html = '';

		for (var i = 0; i < this.gridCellsCnt; i++) {
			html += '<tr>';
			for (var j = 0; j < this.gridCellsCnt; j++) {
				html += `<td id="grid-cell-${i}-${j}"></td>`;
			}
			html += '</tr>';
		}
		html = `<table border="1" width="${this.gridSizePx}" height="${this.gridSizePx}">` + html + '</table>';

		this.el.innerHTML = html;
	}

	clearObjects() {
		var cells = document.querySelectorAll('[id^=grid-cell]');
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.background = 'white';
		}
	}

	drawObjects(objects) {
		var object,
			point,
			cell;

		this.clearObjects();

		for (var i = 0; i < objects.length; i++) {
			object = objects[i];
			for (var j = 0; j < object.points.length; j++) {
				point = object.points[j];
				cell = document.querySelector(`#grid-cell-${point.y}-${point.x}`);
				cell.style.background = object.color;
			}
		}
	}
}

module.exports = RenderEngine;