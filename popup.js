document.addEventListener("DOMContentLoaded", () => {
	const popup = document.getElementById("popup");
	const settingsIcon = document.getElementById("settingsIcon");

	settingsIcon.addEventListener("click", () => {
		popup.classList.toggle("hidden");
	});
});
