
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Grid Helper: Rejilla para establecer un piso
const size = 60;
const divisions = 50;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

//Axes Helper: Linea en el eje x, y, z, ayuda a entender la perspectiva
const axesHelper = new THREE.AxesHelper( 20 );
axesHelper.setColors( 0xffff00,  0xff0000, 0x0000ff);
scene.add( axesHelper );

/*Luz direccional: Una luz directa apuntando desde arriba al cubo de en medio
//Crea un reflejo en la parte superior de los cubos
//Codigo apoyado de:https://programmerclick.com/article/81771039238/
*/
var pointColor = "#ffffff";
var directionalLight = new THREE.DirectionalLight(pointColor);
directionalLight.position.set(5, 2, 5);
directionalLight.castShadow = true;
directionalLight.shadowCameraNear = 2;
directionalLight.shadowCameraFar = 200;
directionalLight.shadowCameraLeft = -50;
directionalLight.shadowCameraRight = 50;
directionalLight.shadowCameraTop = 50;
directionalLight.shadowCameraBottom = -50;

directionalLight.distance = 5;
directionalLight.intensity = 1;
directionalLight.shadowMapHeight = 1024;
directionalLight.shadowMapWidth = 1024;

scene.add(directionalLight);


/*Luz Ambiental: genera una iluminacion calida simulando la luz del sol
//Codigo apoyado de:https://programmerclick.com/article/81771039238/
*/
var ambiColor = "#ffffff";
var ambientLight = new THREE.AmbientLight(ambiColor,1);
scene.add(ambientLight);

function poligono(nlados, radio) {
  const vertices = [];
  const ang = 2 * Math.PI / nlados;
  for (let i = 0; i < nlados; i++) {
    vertices.push([radio * Math.cos(i * ang), radio * Math.sin(i * ang)]);
  }
  return vertices;
}

function poligono3D(verticesBase,vertices,altura){
  const geometry = new THREE.BufferGeometry();

  verticesBase.forEach(vertex => {
    vertices.push(vertex[0], vertex[1], 0); // Agrega las coordenadas x, y y z (z=0 para la base)
  });
  verticesBase.forEach(vertex => {
    vertices.push(vertex[0], vertex[1], altura); // Agrega las coordenadas x, y y z (z=altura para la parte superior)
  });
  const indices = [];
  const numLados = verticesBase.length;
  
  // Caras laterales del prisma
  for (let i = 0; i < numLados; i++) {
      const current = i;
      const next = (i + 1) % numLados;
  
      // Triángulo 1
      indices.push(current, current + numLados, next + numLados);
      // Triángulo 2
      indices.push(current, next + numLados, next);
  }
  
  // Caras superior e inferior del prisma
  for (let i = 0; i < numLados - 2; i++) {
      const current = i + 1;
  
      // Cara superior
      indices.push(0, current, current + 1);
  
  
      // Cara inferior
      indices.push(numLados, numLados + current + 1, numLados + current);
  }

  // Generar un color aleatorio en formato hexadecimal
  const randomColor = Math.random() * 0xffffff;

  const verticesArray = new Float32Array(vertices);
  const indicesArray = new Uint32Array(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3)); // 3 elementos por vértice (x, y, z)
  geometry.computeVertexNormals()
  geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1)); // 1 elemento por índice
  const material =  new THREE.MeshStandardMaterial( { color: randomColor, flatShading: true } );
  const mesh = new THREE.Mesh( geometry, material );
  
  return mesh
}

var PoligonoArreglo = [];
var n = 8;
var desp = 1;
var desp2 = 1;
for (var i = 0; i < n; i++) {
  PoligonoArreglo[i] = poligono3D(poligono(5,1),[],2);
  PoligonoArreglo[i].position.x = desp;
  PoligonoArreglo[i].position.y = 2.5;
  PoligonoArreglo[i].rotation.x = 1;
  desp = desp + 2.5;
  
  if (desp >= 13.5) {
    PoligonoArreglo[i].position.x = desp2;
    PoligonoArreglo[i].position.y = 5.5;
    desp2 = desp2 + 2.5;
 }
}

const group = new THREE.Group();
for (i = 0; i < n; i++) {
  group.add(PoligonoArreglo[i]);
}

scene.add(group);

//Posicion de la camara
camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 10;

renderer.render( scene, camera );


