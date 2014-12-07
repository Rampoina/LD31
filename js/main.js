window.LD31 = window.LD31 || {};

var camera, scene, renderer;
var geometry, material, mesh, faces;
var belts;

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    // camera = new THREE.OrthographicCamera(window.innerWidth / -1, window.innerWidth / 1, window.innerHeight / 1, window.innerWidth / -1, 1, 1000000);
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

    belts = {
        UP: LD31.belts.create(0),
        RIGHT: LD31.belts.create(90),
        DOWN: LD31.belts.create(180),
        LEFT: LD31.belts.create(270)
    };
    _.forEach(belts, (belt) => scene.add(belt.mesh));
    

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    faces = {
        "UP": face(mesh, axisX, 0),
        "DOWN": face(mesh, axisX, 180),
        "RIGHT": face(mesh, axisZ, 90),
        "LEFT": face(mesh, axisZ, 270),
        "FRONT": face(mesh, axisX, 90),
        "BACK": face(mesh, axisX, -90)
    };

    document.body.appendChild(renderer.domElement);

}

function face(mesh, axis, angle) {
    var face = {};
    face.items = [];
    face.origin = new THREE.AxisHelper(30);
    face.origin.rotateOnAxis(axis, angle * (Math.PI / 180));
    mesh.add(face.origin);
    return face;
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
                case "RIGHT":
                    tmp = faces["FRONT"];
                    faces["FRONT"] = faces["RIGHT"];
                    faces["RIGHT"] = faces["BACK"];
                    faces["BACK"] = faces["LEFT"]
                    faces["LEFT"] = tmp;
                    break;
                case "LEFT":
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

    _.forEach(belts, (belt, faceName) => {
        var face = faces[faceName];
        var drop = belt.update(mesh, face.items.length);
        if (drop) {
            var last = _.last(face.items);
            if (last && last.color !== drop.color) {
                face.origin.remove(last.mesh);
                face.items.pop();
                console.log('pop');
            } else {
                face.origin.add(drop.mesh);
                face.items.push(drop);
                console.log('push');
            }
        }
    });

    TWEEN.update();
    renderer.render(scene, camera);

}

setTimeout(() => {
    init();
    animate();
}, 0);
