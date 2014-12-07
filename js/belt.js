window.LD31 = window.LD31 || {};
((exports) => {

	exports.create = function(angle) {
		var belt = {};

		belt.mesh = new THREE.Object3D();
        belt.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle * (Math.PI / 180));

		var currentItem = null;

		var animating = false;

		var dropping = [];
		belt.update = function(mesh, limit) {

			if (currentItem === null) {
				currentItem = newItem();
				currentItem.mesh.position.y = 160 * 11;
				// currentItem.slot = Math.round((Math.random() - .5) * 8) // -4 to 4;
				// currentItem.mesh.position.x = currentItem.slot * 20;
				belt.mesh.add(currentItem.mesh);
			}

			if (!animating) {
				var tween = new TWEEN.Tween({y: currentItem.mesh.position.y})
				.to({y: currentItem.mesh.position.y - 160}, 500);

				tween.onUpdate(function() {
					currentItem.mesh.position.y = this.y;
	            });
				tween.onComplete(() => {
					animating = false;
					if (currentItem.mesh.position.y <= 160.01 * (limit + 1)) {
						dropping.push(currentItem);
						currentItem = null;
					}
	            });
	            animating = true;
	            tween.easing(TWEEN.Easing.Circular.InOut);
	            tween.start();
			}

			var drop = dropping.shift();
			if (drop) {
				belt.mesh.remove(drop.mesh);
				return drop;
			}
			return null;
		};

		return belt;
	};

	var palette = [0x002b36, 0x073642, 0x586e75, 0x657b83,
                0x839496, 0x93a1a1, 0xeee8d5, 0xfdf6e3];
	function newItem() {
		var item = {};
		var color = palette[Math.floor(Math.random() * palette.length - 2)];
		item.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(160, 160, 160),
			new THREE.MeshBasicMaterial({color: color})
		);
		item.color = color;
		return item;
	}

})(window.LD31.belts = {});
