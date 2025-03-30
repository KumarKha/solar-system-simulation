const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");

const speedSlider = document.getElementById("speedSlider");
const speedValueDisplay = document.getElementById("speedValue");

let speedMultiplier = parseFloat(speedSlider.value);

speedSlider.addEventListener("input", () => {
	speedMultiplier = parseFloat(speedSlider.value);
	speedValueDisplay.textContent = `${speedMultiplier.toFixed(1)}x`;
});

let selectedOrbit = "circular";

document.getElementById("orbitType").addEventListener("change", (e) => {
	selectedOrbit = e.target.value;
});

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const sunImg = new Image();
sunImg.src = "icons/sunIcon.png";
const earthImg = new Image();
earthImg.src = "icons/earthIcon.png";
const jupiterImg = new Image();
jupiterImg.src = "icons/jupiterIcon.png";
const marsImg = new Image();
marsImg.src = "icons/marsIcon.png";
const mercuryImg = new Image();
mercuryImg.src = "icons/mercuryIcon.png";
const neptuneImg = new Image();
neptuneImg.src = "icons/neptuneIcon.png";
const saturnImg = new Image();
saturnImg.src = "icons/saturnIcon.png";
const venusImg = new Image();
venusImg.src = "icons/venusIcon.png";
const uranusImg = new Image();
uranusImg.src = "icons/uranusIcon.png";
class Planet {
	constructor(color, radius, angle, speed, size, image = null) {
		this.color = color;
		this.radius = radius;
		this.angle = angle;
		this.speed = speed;
		this.size = size;
		this.moons = [];
		this.trail = [];
		this.image = image;
	}
	// Treat the moons like planets
	addMoon(color, radius, angle, speed, size) {
		this.moons.push(new Planet(color, radius, angle, speed, size));
	}
	update() {
		this.angle += this.speed * speedMultiplier;
	}
	drawTrail(centerX, centerY, maxTrail = 50) {
		const { x, y } = this.getPosition(centerX, centerY);
		this.trail.push({ x, y });

		if (this.trail.length > maxTrail) {
			this.trail.shift();
		}

		for (let i = 0; i < this.trail.length; i++) {
			const point = this.trail[i];
			ctx.beginPath();
			ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.globalAlpha = i / this.trail.length;
			ctx.fill();
		}
		ctx.globalAlpha = 1;

		this.moons.forEach((moon) => {
			moon.drawTrail(x, y, maxTrail);
		});
	}

	getPosition(centerX, centerY) {
		const orbitFn = orbitFunctions[selectedOrbit] || orbitFunctions.circular;
		const { x, y } = orbitFn(this.radius, this.angle);
		return { x: centerX + x, y: centerY + y };
	}
	draw(centerX, centerY) {
		this.update();
		this.drawTrail(centerX, centerY);
		const { x, y } = this.getPosition(centerX, centerY);

		if (this.image) {
			const imgSize = this.size * 5.5;
			ctx.drawImage(
				this.image,
				x - imgSize / 2,
				y - imgSize / 2,
				imgSize,
				imgSize
			);
		} else {
			ctx.beginPath();
			ctx.arc(x, y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.fill();
		}

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
const orbitFunctions = {
	circular: (radius, angle) => ({
		x: radius * Math.sin(angle),
		y: radius * Math.cos(angle),
	}),
	elliptical: (radius, angle) => ({
		x: radius * Math.sin(angle),
		y: radius * Math.cos(angle) * 0.5,
	}),
	spiral: (radius, angle) => {
		// Angle grows infinite, so we need to control it
		const spiralGrowth = 0.05;
		const r = radius + spiralGrowth * angle;

		return {
			x: r * Math.sin(angle),
			y: r * Math.cos(angle),
		};
	},
	wobbly: (radius, angle) => ({
		x: radius * Math.sin(angle * 2),
		y: radius * Math.cos(angle * 3),
	}),
};

const planets = [];

const mercury = new Planet("gray", 50, 0, 0.05, 3, mercuryImg);
const venus = new Planet("orange", 75, 45, 0.035, 5, venusImg);
const earth = new Planet("blue", 100, 90, 0.025, 6, earthImg);
earth.addMoon("lightgray", 10, 0, 0.1, 2);

const mars = new Planet("red", 140, 135, 0.02, 4, marsImg);
mars.addMoon("lightblue", 8, 180, 0.12, 1.5);

const jupiter = new Planet("burlywood", 180, 160, 0.012, 10, jupiterImg);
jupiter.addMoon("white", 14, 45, 0.15, 2);
jupiter.addMoon("gray", 18, 200, 0.08, 2.5);

const saturn = new Planet("gold", 220, 200, 0.01, 9, saturnImg);
saturn.addMoon("lightgray", 12, 60, 0.1, 2);
saturn.addMoon("white", 16, 180, 0.07, 2);

const uranus = new Planet("lightblue", 260, 240, 0.008, 7, uranusImg);
uranus.addMoon("white", 10, 270, 0.09, 1.5);

const neptune = new Planet("royalblue", 300, 300, 0.007, 7, neptuneImg);
neptune.addMoon("lightblue", 9, 90, 0.1, 1.5);

planets.push(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// const planets = [
// 	{ color: "gray", radius: 50, angle: 0, speed: 0.05, size: 3 }, // Mercury
// 	{ color: "orange", radius: 75, angle: 90, speed: 0.035, size: 5 }, // Venus
// 	{ color: "blue", radius: 100, angle: 180, speed: 0.025, size: 6 }, // Earth
// 	{ color: "red", radius: 140, angle: 270, speed: 0.02, size: 4 }, // Mars
// ];

const stars = [];
function makeStars(starAmount) {
	for (let i = 0; i < starAmount; i++) {
		x = Math.floor(Math.random() * canvas.width);
		y = Math.floor(Math.random() * canvas.height);
		alpha = Math.random();
		delta = Math.random() * 0.02 - 0.01;
		stars.push({ x, y, alpha, delta });
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw Sun
	// ctx.beginPath();
	// ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
	// ctx.fillStyle = "yellow";
	// ctx.fill();
	ctx.drawImage(sunImg, centerX - 15, centerY - 15, 50, 50);
	stars.forEach((star) => {
		star.alpha += star.delta;

		if (star.alpha <= 0 || star.alpha >= 1) {
			star.delta *= -1;
			star.alpha = Math.max(0, Math.min(1, star.alpha));
		}

		ctx.beginPath();
		ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
		ctx.fillStyle = `rgba( 255,255,255, ${star.alpha})`;
		ctx.fill();
	});

	planets.forEach((planet) => planet.draw(centerX, centerY));

	requestAnimationFrame(draw);
}
makeStars(100);
draw();
