import * as THREE from 'three';
import * as TWEEN from 'tween.js';

function setStage(shot, { camera, directionalLight }) {
    camera.position.copy(shot.position.start);
    camera.rotation.set(shot.rotation.start.x, shot.rotation.start.y, shot.rotation.start.z);
    directionalLight.intensity = shot.lightIntensity.start;
}

function coordinateEnd(...tweens) {
    return Promise.all(tweens.map((tween => new Promise(resolve => tween.onComplete(resolve)))));
}

// Define the camera positions and lighting settings for the three shots
const trackingData = [
    (context) => {
        const { camera, directionalLight } = context;
        const shot = {
            position: {
                start: new THREE.Vector3(1, -0.25, 0.25), end: new THREE.Vector3(1, -0.25, 0.5),
            },
            rotation: {
                start: { x: 1.5, y: 0, z: 0 }, end: { x: 1.5, y: 0, z: 0 },
            },
            lightIntensity: {
                start: 0, end: 0.5
            },
        };

        setStage(shot, context);

        const transitionDuration = 19750;
        
        const positionTween = new TWEEN.Tween(camera.position)
            .to(shot.position.end, transitionDuration)
            .start();

        // Define the camera tween
        const rotationTween = new TWEEN.Tween({...shot.rotation.start})
            .to(shot.rotation.end, transitionDuration)
            .onUpdate(function () {
                camera.rotation.set(this.x, this.y, this.z);
            })
            .start();

        // Define the light tween
        const lightTween = new TWEEN.Tween(directionalLight)
            .to({ intensity: shot.lightIntensity.end }, transitionDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
        
        return coordinateEnd(positionTween, rotationTween, lightTween);
    },
    (context) => {
        const { camera, directionalLight } = context;
        const shot = {
            position: {
                start: new THREE.Vector3(1, 0.25, 0.75), end: new THREE.Vector3(1, 0.85, 0.9),
            },
            rotation: {
                start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0.7 },
            },
            lightIntensity: {
                start: 0, end: 0.75
            }
        };

        setStage(shot, context);
        
        const transitionDuration = 18000; // hit at 9

        const positionTween = new TWEEN.Tween(camera.position)
            .to(shot.position.end, transitionDuration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

            console.log(camera);

        // Define the camera tween
        const rotationTween = new TWEEN.Tween({...shot.rotation.start})
            .to(shot.rotation.end, transitionDuration)
            .onUpdate(function () {
                camera.rotation.set(this.x, this.y, this.z);
            })
            .start();

        // Define the light tween
        const lightTween = new TWEEN.Tween(directionalLight)
            .to({ intensity: shot.lightIntensity.end }, transitionDuration)
            .start();
        
        return coordinateEnd(positionTween, rotationTween, lightTween);
    },
    (context) => {
        const { camera, directionalLight } = context;
        const shot = {
            position: {
                start: new THREE.Vector3(1, -0.25, 0.5), end: new THREE.Vector3(1, 0.5, 5),
            },
            rotation: {
                start: { x: 1.5, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 },
            },
            lightIntensity: {
                start: 0, end: 1
            }
        };

        setStage(shot, context);

        const transitionDuration = 28500;

        const positionTween = new TWEEN.Tween(camera.position)
            .to(shot.position.end, transitionDuration)
            .easing(TWEEN.Easing.Exponential.In)
            .start();

            console.log(camera);

        // Define the camera tween
        const rotationTween = new TWEEN.Tween({...shot.rotation.start})
            .to(shot.rotation.end, transitionDuration)
            .onUpdate(function () {
                camera.rotation.set(this.x, this.y, this.z);
            })
            .start();

        // Define the light tween
        const lightTween = new TWEEN.Tween(directionalLight)
            .to({ intensity: shot.lightIntensity.end }, transitionDuration)
            .start();
        
        return coordinateEnd(positionTween, rotationTween, lightTween);
    },
    async (context) => {
        context.happyBirthday.visible = true;

        await new Promise(resolve => setTimeout(resolve, 1950));

        context.william.visible = true;

        await new Promise(resolve => setTimeout(resolve, 1950));

        context.ambientLight.intensity = 0.5;
    }
  ];
  
  // Function to transition to the next camera shot
  function transitionToNextShot(context) {
    const nextShot = trackingData[0];

    const shotGroup = nextShot(context);
  
    // Wait for the transition to complete and then transition to the next shot
    shotGroup.then(() => {
        const currentShot = trackingData.shift(); // Take the first shot from the array
        // trackingData.push(currentShot); // Move it to the end of the array
        if (trackingData.length === 0) return;
        transitionToNextShot(context);
    });
}
  
export function startShots(context) {
    // Set up the initial camera position and lighting
    // camera.position.copy(trackingData[0].position.start);
    // camera.rotation.copy(trackingData[0].rotation.start);
    // // camera.lookAt(trackingData[0].position.end);
    // console.log(camera);
    // directionalLight.intensity = trackingData[0].lightIntensity.start;

    transitionToNextShot(context);
}
  