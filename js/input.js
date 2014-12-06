window.LD31 = window.LD31 || {};
((exports) => {

	var keymap = {
		40: 'DOWN',
		38: 'UP',
		37: 'LEFT',
		39: 'RIGHT'
	};

	var queue = [];

	document.addEventListener("keydown", (e) => {
		if (keymap[e.keyCode]) {
			if (queue.length < 3) {
				queue.push(keymap[e.keyCode]);
			}
		}
	}, false);

	exports.shift = queue.shift.bind(queue);

})(window.LD31.input = {});