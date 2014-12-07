window.LD31 = window.LD31 || {};
((exports) => {

	exports.create = function(angle) {
		var belt = {};

		belt.mesh = new THREE.Object3D();
        belt.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle * (Math.PI / 180));

		var currentItem = null;

		var animating = false;

		belt.update = function(mesh, faces) {
            var face;
            switch (angle) {
                case 0:
                    face = faces["UP"];
                    break;
                case 90:
                    face = faces["RIGHT"];
                    break;
                case 180:
                    face = faces["DOWN"];
                    break;
                case 270:
                    face = faces["LEFT"];
                    break;
            }

			if (currentItem === null) {
				currentItem = newItem();
				currentItem.mesh.position.y = 160 * 11;
				// currentItem.slot = Math.round((Math.random() - .5) * 8) // -4 to 4;
				// currentItem.mesh.position.x = currentItem.slot * 20;
				belt.mesh.add(currentItem.mesh);
			}

			if (!animating) {
				console.log('go');
				var tween = new TWEEN.Tween({y: currentItem.mesh.position.y})
				.to({y: currentItem.mesh.position.y - 160}, 1000);

				tween.onUpdate(function() {
					currentItem.mesh.position.y = this.y;
	            });
				tween.onComplete(() => {
					animating = false;
					if (currentItem.mesh.position.y <= 160.01*(face.length + 1)) {
						belt.mesh.remove(currentItem.mesh);
                        mesh.add(currentItem.mesh);
                        face.push(currentItem);
						currentItem = null;
					}
	            });
	            animating = true;
	            tween.easing(TWEEN.Easing.Circular.InOut);
	            tween.start();
			}
		};

		return belt;
	};

	function newItem() {
		var item = {};
		item.mesh = new THREE.Mesh(new THREE.BoxGeometry(160, 160, 160), new THREE.MeshBasicMaterial({color: 0x00ff00}));
		return item;
	}

})(window.LD31.belts = {});
