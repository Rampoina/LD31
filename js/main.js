window.LD31 = window.LD31 || {};

var camera, scene, renderer;
var geometry, material, mesh;

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

var targetRotation = null;
var animate = () => {

    requestAnimationFrame(animate);


    if (!targetRotation) {
        var input = LD31.input.shift();
        if (input) {
            targetRotation = input;
            // rotate cube in "animation" direction until done, then set animation to null again
            var axis = 'y';
            if (input === 'UP' || input === 'DOWN') {
                axis = 'x';
            } else if (mesh.rotation.x * 180 / Math.PI % 180 !== 0) {
                axis = 'z';
            } else {
                axis = 'y';
            }
            var degrees = 90 * (input === 'UP' || input === 'LEFT' ? -1 : 1);
            targetRotation = {[axis]: mesh.rotation[axis] + degrees * (Math.PI / 180)};
            var tween = new TWEEN.Tween(mesh.rotation).to(targetRotation, 500);

            tween.onComplete(() => {
                targetRotation = null;
            });
            tween.easing(TWEEN.Easing.Circular.InOut)
            tween.start();
        }
    }

    TWEEN.update();

    renderer.render(scene, camera);

}

init();
animate();