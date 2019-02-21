"use strict";
/**
 * 
 */

function byId(id) {
	return document.getElementById(id);
}

function byClass(id) {
	return document.getElementsByClass(id);
}

var namedElements = {};
[... document.getElementsByTagName("*")]
	.filter(x => x.hasAttribute("id"))
	.forEach(x => namedElements[x.getAttribute("id")] = x);

var canvas = namedElements.canvas;
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
const cellSize = 10;

var w = width / cellSize;
var h = height / cellSize;

var map = new Int8Array(w * h);
var newMap = new Int8Array(w * h);
var countMap = new Int8Array(w * h);

var intervalIndex = -1;

function drawLine(x1, y1, x2, y2, style) {
	if (typeof style === "undefined") {
		ctx.strokeStyle = "black";
	}
	else {
		ctx.strokeStyle = style;
	}
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawCell(x, y, alive) {
	ctx.strokeStyle = "black";
//	if (alive) {
		ctx.fillStyle = "rgba(0,0,255,.4)";
//	}
//	else {
//		ctx.fillStyle = "rgba(255,0,0,.4)";
//	}
	ctx.beginPath();
	
	ctx.arc((x + .5) * cellSize, (y + .5) * cellSize, cellSize / 2, 0, Math.PI * 2);
	
	ctx.stroke();
	ctx.fill();
}



function update() {
	for (let i = 0; i < map.length; ++i) {
		let x = i % w;
		let y = (i - x) / w;
		let minx = Math.max(0, x - 1);
		let maxx = Math.min(w, x + 1);
		let miny = Math.max(0, y - 1);
		let maxy = Math.min(h, y + 1);
		
		let c = 0;
		for (let cy = miny; cy <= maxy; ++cy) {
			for (let cx = minx; cx <= maxx; ++cx) {
				if (map[cx + cy * w]) {
					++c;
				}
			}
		}
		
		let m = map[i];
		countMap[i] = c;
		
		newMap[i] = map[i];
		if (m) {
			newMap[i] = ((c >= 3) && (c <= 4));
		}
		else {
			newMap[i] = (c == 3);
		}
	}
	
	var tmpMap = map;
	map = newMap;
	newMap = tmpMap;
	

	render();
}

function render() {

	ctx.fillStyle = "white";
	ctx.fillRect(0,0,width, height);

	for (let i = 0; i < width; i += cellSize) {
		drawLine(i, 0, i, height, "rgba(0,0,0,.1)");
	}
	
	for (let i = 0; i < width; i += cellSize) {
		drawLine(0, i, width, i, "rgba(0,0,0,.1)");
	}
	
	for (let y = 0; y < h; ++y) {
		for (let x = 0; x < w; ++x) {
			let cell = map[x + y * w]
			if (cell) {
				drawCell(x, y);
			}
		}
	}

//	ctx.strokeStyle = "black";
//	for (let y = 0; y < h; ++y) {
//		for (let x = 0; x < w; ++x) {
//			let c = countMap[x + y * w];
//			if (c) {
//				ctx.strokeText(c, (x + .5) * cellSize, (y + .5) * cellSize);
//			}
//		}
//	}
}

function canvasClick(event, rightMouse) {
	var boundingRect = canvas.getBoundingClientRect();
	var screenX = event.clientX - boundingRect.x;
	var screenY = event.clientY - boundingRect.y;
	
	var x = Math.floor(screenX / cellSize);
	var y = Math.floor(screenY / cellSize);
	
	if (rightMouse) {
		map[x + y * w] = 0;
	}
	else {
		map[x + y * w] = 1;
	}
	
	event.preventDefault();
	
	render();
}

ctx.font = "25px";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

//render();
update();

namedElements.step.addEventListener("click", update);
namedElements.canvas.addEventListener("click", canvasClick);
namedElements.canvas.addEventListener("contextmenu", x => canvasClick(x, true))
namedElements.start.addEventListener("click", function() {
	clearInterval(intervalIndex);
	intervalIndex = setInterval(update, 200);
});
namedElements.stop.addEventListener("click", function() {
	clearInterval(intervalIndex);
	intervalIndex = -1;
});

namedElements.random.addEventListener("click", function() {
	for (let i = 0; i < map.length; ++i) {
		map[i] = 1 * (Math.random() > .85);
	}
	render();
});

namedElements.clear.addEventListener("click", function() {
	for (let i in map) {
		map[i] = 0;
	}
	render();
});




