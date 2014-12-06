window.LD31 = window.LD31 || {};

var camera, scene, renderer;
var geometry, material, mesh;

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        vertexColors: THREE.FaceColors
    });

    mesh = new THREE.Mesh(geometry, material);
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
    }
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
            var axis = input === 'UP' || input === 'DOWN' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
            var angle = {value: 90 * (input === 'UP' || input === 'LEFT' ? -1 : 1)};
            console.log('go', angle.value)
            targetRotation = mesh.quaternion.clone();
            

            var tween = new TWEEN.Tween({value: 0}).to(angle, 250);

            var q = new THREE.Quaternion();
            tween.onUpdate(function() {
                q.setFromAxisAngle(axis, this.value * (Math.PI / 180));
                mesh.quaternion.copy(targetRotation); // reset to origin
                mesh.quaternion.multiplyQuaternions(q, mesh.quaternion); // apply rotation progress
            });

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