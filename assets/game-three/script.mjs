import { setConfiguration } from "../configuration-collector.mjs";
import { createReactive, wait, waitForEvent } from "../utilities.mjs";

const bgmCheckbox = document.getElementById('bgm-check');
const sfxCheckbox = document.getElementById('sfx-check');
const screen = document.getElementById('screen3');
const gameArea = screen.querySelector('.game-area');
const instructions = screen.querySelector('.instructions');
const finalCountdown = screen.querySelector('.numbers :last-child');
const man = screen.querySelector('.blowing-man');
const cake = screen.querySelector('.birthday-cake');
const bgmAudio = screen.querySelector('audio.bgm');
const sfxAudio = screen.querySelector('audio.sfx');

bgmCheckbox.addEventListener('change', () => {
    bgmAudio.muted = !bgmCheckbox.checked;
});
sfxCheckbox.addEventListener('change', () => {
    sfxAudio.muted = !sfxCheckbox.checked;
});

const countdownSFX = () => {
    if (!sfxCheckbox.checked) return;
    // Create an audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Define tones (frequency in Hz and duration in seconds)
    const tune = [
        { frequency: 261.63, duration: 0.5 },  // C4
        { silence: true, duration: 0.5 },
        { frequency: 261.63, duration: 0.5 },  // C4
        { silence: true, duration: 0.5 },
        { frequency: 261.63, duration: 0.5 },  // C4
        { silence: true, duration: 0.5 },
        { frequency: 523.25, duration: 1 }   // C5
    ];
    
    // Function to play a note
    function playNote(audioCtx, frequency, duration, startTime) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Get the current time
    let currentTime = audioCtx.currentTime;
    
    // Schedule the tune
    tune.forEach(note => {
        if (!note.silence) {
            playNote(audioCtx, note.frequency, note.duration, currentTime);
        }
        currentTime += note.duration;
    });
};

function getAnimationDuration(element) {
    const computedStyle = window.getComputedStyle(element);
    const animationDuration = computedStyle.animationDuration;

    // The animationDuration is returned as a string in the format "2s" or "200ms"
    // We need to parse this to get the duration in milliseconds.
    let durationInMilliseconds = 0;

    if (animationDuration.includes('ms')) {
        durationInMilliseconds = parseFloat(animationDuration);
    } else if (animationDuration.includes('s')) {
        durationInMilliseconds = parseFloat(animationDuration) * 1000;
    }

    return durationInMilliseconds;
}

instructions.addEventListener('transitionend', () => gameArea.classList.add('state-1'), { once: true });
instructions.addEventListener('click', async () => {
    instructions.classList.add('hidden');
    await wait(500);
    countdownSFX();
}, { once: true });
finalCountdown.addEventListener('animationend', async () => {
    bgmAudio.play();
    gameArea.classList.remove('state-1');
    gameArea.classList.add('state-2');
    let clicks = createReactive(0);
    let state = 2;
    const clickCounter = () => clicks.value++;
    gameArea.addEventListener('click', clickCounter, false);
    clicks.subscribe(value => {
        if (state === 2 && value >= 30) {
            state = 3;
            gameArea.classList.remove('state-2');
            gameArea.classList.add('state-3');
        } else if (state === 3 && value >= 60) {
            state = 4;
            gameArea.classList.remove('state-3');
            gameArea.classList.add('state-4');
        }
    });
    await wait(10000);
    gameArea.removeEventListener('click', clickCounter);
    man.style.animationPlayState = 'paused';
    await wait(2000);
    gameArea.classList.remove('state-2', 'state-3', 'state-4');
    gameArea.classList.add('state-5');
    man.style.animationPlayState = 'running';
    await wait(750);
    sfxAudio.play();
    await waitForEvent(man, 'animationend');
    await wait(1000);
    gameArea.classList.remove('state-5');
    gameArea.classList.add('state-6');
    await waitForEvent(man, 'transitionend');
    gameArea.classList.remove('state-6');
    setConfiguration('tap score', String(clicks.value).padStart(3, "0"));
    const animationDuration = getAnimationDuration(cake);
    const successRating = Math.min(clicks.value / 75, 1);
    const playLength = animationDuration * successRating;
    gameArea.classList.add('state-7');
    if (successRating < 1) {
        await wait(playLength);
        cake.style.animationPlayState = 'paused';
    } else {
        await waitForEvent(cake, 'animationend');
    }
    await wait(2000);
    instructions.classList.remove('hidden');
}, { once: true });
