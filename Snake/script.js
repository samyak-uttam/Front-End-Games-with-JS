var keymap = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var context, gameStarted = false, intervalId;

class stage {
	static width = 540;
	static height = 540;
	static length = [];
	static food = {};
	static score = 0;
	static direction = 'right';
	static config = {
		cw: 36,		// cell width
		size: 4,	// default size of snake
		fps: 1000	// frames per sec
	};
}

function addFood() {
	do {
		stage.food = {
			x: Math.round(Math.random() * (stage.width / stage.config.cw - 1)),
			y: Math.round(Math.random() * (stage.height / stage.config.cw - 1))
		}
	} while(checkCollisionWithBody(stage.food.x, stage.food.y) == true);
}

function init(width, height, config) {
	stage.width = width;
	stage.height = height;

	// set score
	stage.score = 0;
	$(".score").text(stage.score);

	// set direction
	stage.direction = 'right';

	// initialize the configurations
	for (let key in config) {
		if (stage.config.hasOwnProperty(key)) {
			stage.config[key] = config[key];
		}
	}

	// initialize snake
	stage.length = [];
	for(var i = 0; i < stage.config.size; i++) {
		stage.length.push({x: i, y: 0});
	}

	addFood();
}

function drawGrid() {
	// set grid line color
	context.strokeStyle = 'rgba(0, 0, 0, 0.35)';

	let gridSize = stage.config.cw;
	for (let x = gridSize; x < stage.width; x += gridSize) {
		// draw vertical lines
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, stage.height);
		context.stroke();

		// draw horizontal lines
		context.beginPath();
		context.moveTo(0, x);
		context.lineTo(stage.width, x);
		context.stroke();
	}
}

function drawCell(x, y, type) {
	let cw = stage.config.cw;
	let radius = cw / 2 - 4;
	if (type == 'snake') {
		context.fillStyle = 'rgb(68, 113, 230)';
	} else {
		context.fillStyle = 'rgb(231, 71, 29)';
	}
	context.beginPath();
	context.arc((x * cw + cw / 2), (y * cw + cw / 2), radius, 0, 2 * Math.PI);
	context.fill();
}

function draw() {
	// draw stage
	context.fillStyle = 'rgb(170, 215, 81)';
	context.fillRect(0, 0, stage.width, stage.height);

	// draw grid
	drawGrid();

	// draw snake
	stage.length.forEach(cell => {
		drawCell(cell.x, cell.y, 'snake');
	});

	// draw food
	drawCell(stage.food.x, stage.food.y, 'food');
}

function restart() {
	gameStarted = false;
	clearInterval(intervalId);
}

function checkCollisionWithBody(px, py) {
	if (stage.length.length < 4)
		return false;
	for (let i = 0; i < stage.length.length; i++) {
		let cell = stage.length[i];
		if (cell.x == px && cell.y == py) {
			return true;
		}
	}
	return false;
}

function checkCollision(px, py) {
	if ((px == -1 || px == stage.width / stage.config.cw) 
			|| (py == -1 || py == stage.height / stage.config.cw)
			|| checkCollisionWithBody(px, py)) {
		return true;
	}
	return false;
}

function game() {
	// draw all the components
	draw();

	// snake position
	let px = stage.length[0].x;
	let py = stage.length[0].y;

	// add position based on current direction
	switch(stage.direction) {
	case 'right':
		px++;
		break;
	case 'left':
		px--;
		break;
	case 'up':
		py--;
		break;
	case 'down':
		py++;
		break;
	}

	// check for collision
	if (checkCollision(px, py) == true) {
		restart();
		return;
	}

	// snake food
	if (px == stage.food.x && py == stage.food.y) {
		var head = {x: px, y: py};
		stage.score++;
		$(".score").text(stage.score);
		addFood();
	} else {
		var head = stage.length.pop();
		head.x = px;
		head.y = py;
	}
	stage.length.unshift(head);
}

$(document).keydown(function(event) {
	if (gameStarted == true) {
		let key = keymap[event.which];
		let dir = stage.direction;
		if (typeof(key) != 'undefined') {
			if ((dir == 'right' && key == 'left') || (dir == 'left' && key == 'right')
				|| (dir == 'up' && key == 'down') || (dir == 'down' && key == 'up')) {
				stage.direction = dir;
			} else {
				stage.direction = key;
			}
		}
	}
});

$(document).ready(function() {
	let canvas = $("#game-canvas").get(0);
	context = canvas.getContext("2d");
	draw();
});

$("#play").click(function() {
	if (gameStarted == false) {
		// start the game
		gameStarted = true;

		let canvas = $("#game-canvas").get(0);
		init(canvas.width, canvas.height, {fps: 120, size: 3});

		// game interval
		intervalId = setInterval(() => {game();}, stage.config.fps);
	}
});