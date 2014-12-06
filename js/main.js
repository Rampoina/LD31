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

var animation = null;
var animate = () => {

    requestAnimationFrame(animate);


    if (!animation) {
        var input = LD31.input.shift();
        if (input) {
            animation = input;
        }
    }

    if (animation) {
        // rotate cube in "animation" direction until done, then set animation to null again
        mesh.rotation.y += 0.01;
        console.log(mesh.rotation.y);
    }

    renderer.render(scene, camera);

}

init();
animate();