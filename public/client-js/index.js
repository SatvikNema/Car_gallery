document.addEventListener("DOMContentLoaded", () => {
	const messageHandle = document.querySelector(".flash");
	if (messageHandle) {
		console.log(messageHandle.innerText);
		if (messageHandle.innerText !== "") {
			setTimeout(() => {
				messageHandle.innerText = "";
			}, 3000);
		}
	}
});
