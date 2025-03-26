const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");

const speedSlider = document.getElementById("speedSlider");
const speedValueDisplay = document.getElementById("speedValue");

let speedMultiplier = parseFloat(speedSlider.value);

speedSlider.addEventListener("input", () => {
	speedMultiplier = parseFloat(speedSlider.value);
	speedValueDisplay.textContent = `${speedMultiplier.toFixed(1)}x`;
});
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

class Planet {
	constructor(color, radius, angle, speed, size) {
		this.color = color;
		this.radius = radius;
		this.angle = angle;
		this.speed = speed;
		this.size = size;
		this.moons = [];
	}
	// Treat the moons like planets
	addMoon(color, radius, angle, speed, size) {
		this.moons.push(new Planet(color, radius, angle, speed, size));
	}
	update() {
		this.angle += this.speed * speedMultiplier;
	}
	getPosition(centerX, centerY) {
		const x = centerX + this.radius * Math.sin(this.angle);
		const y = centerY + this.radius * Math.cos(this.angle);
		return { x, y };
	}
	draw(centerX, centerY) {
		this.update();
		const { x, y } = this.getPosition(centerX, centerY);

		ctx.beginPath();
		ctx.arc(x, y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();

		this.moons.forEach((moon) => {
			moon.update();
			const { x: xm, y: ym } = moon.getPosition(x, y);
			ctx.beginPath();
			ctx.arc(xm, ym, moon.size, 0, Math.PI * 2);
			ctx.fillStyle = moon.color;
			ctx.fill();
		});
	}
}

const planets = [];

const mercury = new Planet("gray", 50, 0, 0.05, 3);
const venus = new Planet("orange", 75, 45, 0.035, 5);
const earth = new Planet("blue", 100, 90, 0.025, 6);
earth.addMoon("lightgray", 10, 0, 0.1, 2);

const mars = new Planet("red", 140, 135, 0.02, 4);
mars.addMoon("lightblue", 8, 180, 0.12, 1.5);

const jupiter = new Planet("burlywood", 180, 160, 0.012, 10);
jupiter.addMoon("white", 14, 45, 0.15, 2);
jupiter.addMoon("gray", 18, 200, 0.08, 2.5);

const saturn = new Planet("gold", 220, 200, 0.01, 9);
saturn.addMoon("lightgray", 12, 60, 0.1, 2);
saturn.addMoon("white", 16, 180, 0.07, 2);

const uranus = new Planet("lightblue", 260, 240, 0.008, 7);
uranus.addMoon("white", 10, 270, 0.09, 1.5);

const neptune = new Planet("royalblue", 300, 300, 0.007, 7);
neptune.addMoon("lightblue", 9, 90, 0.1, 1.5);

planets.push(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// const planets = [
// 	{ color: "gray", radius: 50, angle: 0, speed: 0.05, size: 3 }, // Mercury
// 	{ color: "orange", radius: 75, angle: 90, speed: 0.035, size: 5 }, // Venus
// 	{ color: "blue", radius: 100, angle: 180, speed: 0.025, size: 6 }, // Earth
// 	{ color: "red", radius: 140, angle: 270, speed: 0.02, size: 4 }, // Mars
// ];

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw Sun
	ctx.beginPath();
	ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
	ctx.fillStyle = "yellow";
	ctx.fill();

	planets.forEach((planet) => planet.draw(centerX, centerY));

	requestAnimationFrame(draw);
}

draw();
