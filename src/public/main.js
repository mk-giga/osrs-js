
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { Tilemap } from './client-src/map/Map.js';

var objLoader = new OBJLoader();
var mtlLoader = new MTLLoader();
var objModel = null;

const ambientLight = new THREE.AmbientLight(new THREE.Color(THREE.Color.NAMES.white), 1);
const directionalLight = new THREE.DirectionalLight(new THREE.Color(THREE.Color.NAMES.white), 1);
directionalLight.position.set(0.2, 1.2, 0);
directionalLight.castShadow = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer();

const tilemapModel = new Tilemap(8, 8);
scene.add(tilemapModel.getMesh());

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.loader = {
    gradientLoader: new THREE.TextureLoader(),
    textureLoader: new THREE.TextureLoader(),
    loadedGradients: false,
    loadedTextures: false,
    loadedModels: false,
    
    textures: {

    },
    gradients: {

    },

    initLoaders: function() {
        this.gradientLoader.manager.onLoad = this.onLoadedGradients;
        this.textureLoader.manager.onLoad = this.onLoadedTextures;
    },

    init() {
        this.initLoaders();
        this.loadGradients();
        this.textures = {
            
        }
    },

    onLoadedGradients: async function() {
        this.loadedTextures = true;
    },

    onLoadedTextures: async function() {
        this.loadedGradients = true;
    },

    loadTextures: function(){
        this.textureLoader.setPath('./models/');
    },
    loadGradients: function() {
        this.gradientLoader.setPath('./models/gradients/');
        
    }
}

camera.position.z = 5;
camera.position.z = 10;

renderer.setClearColor(new THREE.Color(THREE.Color.white), 1);

let controls = new FirstPersonControls( camera, renderer.domElement );
  controls.movementSpeed = 400;
  controls.lookVertical = true;
  controls.lookSpeed = 0.8;
  controls.autoForward = false;


function main() {
    init();
}

function init() {
    window.loader.init();
}

mtlLoader.load("./models/rsmtl.mtl", (materials)=>{
    
    objLoader.setMaterials(materials);
    
    objLoader.load("./models/rsobj.obj", (model) => {
        
        objModel = model;
        objModel
        scene.add(objModel);
        scene.add(directionalLight);
        scene.add(ambientLight);
        setInterval(animate, 1000/144);
    }, (ev) => {
        console.log(ev);
    }, (ev) => {
        console.log("error");
    });

    
}, (ev) => {
    console.log(ev);
}, (ev) =>{
    console.log("error");
});

function animate() {
    
    renderer.setAnimationLoop(()=>{
        controls.update(0.01);
        renderer.render(scene, camera);
    })
    
}

main();



