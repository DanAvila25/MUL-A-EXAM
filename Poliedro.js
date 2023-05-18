var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT);
camera.position.z = 20;
camera.position.x = 8;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

function poligono(nlados, radio)
{
  const vertices = [];
    const ang = 2*Math.PI/nlados;
    for (let i = 0; i <= nlados; i++) {
        let x = radio * Math.cos(i * ang);
        let y = radio * Math.sin(i * ang);
        //Union de los vertices 
        vertices[i] = new THREE.Vector3(x, y, 0);        
    }
    return vertices;
}

function poliedro(nlados, radio,altura){
  const vertices=poligono(nlados,radio); 
  //Define un plano de forma 3d
  const forma = new THREE.Shape(vertices);  
  const lim = { depth: altura, bevelEnabled: false };
  
  const geometry = new THREE.ExtrudeBufferGeometry(forma, lim);  
  const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  //Creacion del Pentagono
  const fig = new THREE.Mesh(geometry, material);  
  return fig;
}

var pentagono = poliedro(5,3,3);
scene.add(pentagono);



//Aplicacion de luz 
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const size = 150;
const divisions = 160;
//Creación de ejes
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);
//Creacion de la grilla
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);
//Funcion para renderizar
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();