import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import fontUrl from 'url:./typefaces/helvetiker_regular.typeface';
import { startShots } from './scenes';

function createText(text, font, options) {
    // Create the 3D text geometry
    const textGeometry = new TextGeometry(text, {
        font,
        size: 1,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 5,
        ...options
    });

    // Create a material for the text
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

    // Create a mesh to hold the text geometry and material
    return new THREE.Mesh(textGeometry, textMaterial);
}

let context = {};
async function init() {
    // Get the container element
    const container = document.getElementById('scene');

    // Create a scene
    const scene = new THREE.Scene();

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const loader = new FontLoader();
    const font = await loader.loadAsync(fontUrl);

    scene.add(createText('16', font));

    const thinScreen = window.innerWidth < window.innerHeight;

    const happyBirthday = createText('Happy Birthday', font, { height: 0.1, size: thinScreen ? 0.25 : 1  });
    thinScreen ? happyBirthday.position.set(-0.15, 1.5, 0) : happyBirthday.position.set(-3.25, 1.5, 0);
    happyBirthday.visible = false;
    scene.add(happyBirthday);

    const william = createText('William', font, { height: 0.1, size: thinScreen ? 0.5 : 1 });
    thinScreen ? william.position.set(-0.1, -1.5, 0) : william.position.set(-1.25, -1.5, 0);
    william.visible = false;
    scene.add(william);

    context = { scene, renderer, camera, directionalLight, ambientLight, happyBirthday, william };
}

// Render the scene
async function animate(time) {
    if (window.playing !== true) return;
    // camera.position.y += 0.01;
    // camera.position.x += 0.01;
    requestAnimationFrame(animate);
    context.renderer.render(context.scene, context.camera);
    TWEEN.update(time);
}
init().then(() => {
    context.renderer.render(context.scene, context.camera);
});
window.playThreeAnimation = () => {
    animate();
    startShots(context);
}
window.playing = true;
