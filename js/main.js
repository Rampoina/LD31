window.LD31 = window.LD31 || {};

var camera, scene, renderer;
var geometry, material, mesh, faces;
var belts;

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    //camera = new THREE.OrthographicCamera(window.innerWidth / -1, window.innerWidth / 1, window.innerHeight / 1, window.innerWidth / -1, 1, 1000000);
    camera.position.z = 1600;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(160, 160, 160);
    material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        vertexColors: THREE.FaceColors
    });

    mesh = new THREE.Mesh(geometry, material);
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
    }
    scene.add(mesh);

    belts = [LD31.belts.create(90), LD31.belts.create(0), LD31.belts.create(180), LD31.belts.create(270)];
    belts.forEach((belt) => scene.add(belt.mesh));
    

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    faces = {"UP": [],
             "DOWN": [],
             "RIGHT": [], 
             "LEFT": [], 
             "FRONT": [], 
             "BACK": []
    };

    document.body.appendChild(renderer.domElement);

}
function swap(hash, value1, value2) {
    var tmp = hash[value1];
    hash[value2] = hash[value2];
    hash[value1] = tmp;
}

var originalRotation = null;
var axisX = new THREE.Vector3(1, 0, 0);
var axisY = new THREE.Vector3(0, 1, 0);
var axisZ = new THREE.Vector3(0, 0, 1);
var animate = () => {

    requestAnimationFrame(animate);


    if (!originalRotation) {
        var input = LD31.input.shift();
        if (input) {
            originalRotation = mesh.quaternion.clone();
            var tmp;
            switch (input) {
                case "UP":
                    tmp = faces["FRONT"];
                    faces["FRONT"] = faces["DOWN"]
                    faces["DOWN"] = faces["BACK"]
                    faces["BACK"] = faces["UP"];
                    faces["UP"] = tmp;
                    break;
                case "DOWN":
                    tmp = faces["FRONT"];
                    faces["FRONT"] = faces["UP"]
                    faces["UP"] = faces["BACK"];
                    faces["BACK"] = faces["DOWN"];
                    faces["DOWN"] = tmp;
                    break;
                case "lEFT":
                    tmp = faces["FRONT"];
                    faces["FRONT"] = faces["RIGHT"];
                    faces["RIGHT"] = faces["BACK"];
                    faces["BACK"] = faces["LEFT"]
                    faces["LEFT"] = tmp;
                    break;
                case "RIGHT":
                    tmp = faces["FRONT"];
                    faces["FRONT"] = faces["LEFT"];
                    faces["LEFT"] = faces["BACK"];
                    faces["BACK"] = faces["RIGHT"]
                    faces["RIGHT"] = tmp;
                    break;
            }

            var axis = input === 'UP' || input === 'DOWN' ? axisX : axisY;
            var tween = new TWEEN.Tween({value: 0}).to({value: 90 * (input === 'UP' || input === 'LEFT' ? -1 : 1)}, 250);

            var q = new THREE.Quaternion();
            tween.onUpdate(function() {
                q.setFromAxisAngle(axis, this.value * (Math.PI / 180));
                mesh.quaternion.copy(originalRotation); // reset to origin
                mesh.quaternion.multiplyQuaternions(q, mesh.quaternion); // apply rotation progress
            });

            tween.onComplete(() => {
                originalRotation = null;
            });
            tween.easing(TWEEN.Easing.Circular.InOut)
            tween.start();
        }
    }

    belts.forEach((belt) => belt.update(mesh, faces));
    console.log(mesh);

    TWEEN.update();
    renderer.render(scene, camera);

}

setTimeout(() => {
    init();
    animate();
}, 0);
