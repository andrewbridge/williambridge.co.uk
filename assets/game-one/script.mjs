import { setConfiguration } from "../configuration-collector.mjs";

const screen = document.getElementById('screen1');
const gameArea = screen.querySelector('.game-area');
const instructions = screen.querySelector('.instructions');
const player = screen.querySelector('.player');
const itemBoxes = screen.querySelectorAll('.item-box');
const animalsSprite = screen.querySelector('.animals.sprite');
const biomesSprite = screen.querySelector('.biomes.sprite');
const weatherSprite = screen.querySelector('.weather.sprite');

const getSelection = (sprite) => {
    const spriteSteps = parseInt(getComputedStyle(sprite).getPropertyValue('--sprite-animation-steps'), NaN);
    const divider = spriteSteps - 1;
    const sectionSize = 100 / divider;
    const currentSection = parseFloat(getComputedStyle(sprite).getPropertyValue('background-position-x'));
    return Math.round(currentSection / sectionSize);
}

const waitForPlayerJump = (itemBox) => {
    gameArea.addEventListener('click', () => {
        player.classList.add('jump');
        // .4s * 69.0983% ~= 276, I've taken 50ms to account for some delay
        setTimeout(() => itemBox.classList.add('hit'), 226);
    }, { once: true });
    return new Promise((resolve) => {
        player.addEventListener('animationend', () => {
            player.classList.remove('jump');
            resolve();
        }, { once: true });
    });
}

instructions.addEventListener('click', async () => {
    let resolveWaiter;
    const playerReady = () => new Promise((resolve) => {
        resolveWaiter = resolve;
    });
    const transitionHandler = () => {
        player.classList.remove('transitioning');
        if (typeof resolveWaiter === 'function') {
            resolveWaiter();
        }
    };
    player.addEventListener('transitionend', transitionHandler);
    itemBoxes.forEach((box) => box.addEventListener('transitionend', transitionHandler));
    gameArea.classList.toggle('state-1');
    player.classList.add('transitioning');
    await playerReady();
    await waitForPlayerJump(itemBoxes[0]);
    const animalSelection = getSelection(animalsSprite);
    setConfiguration('animal', animalSelection);
    gameArea.classList.toggle('state-1');
    gameArea.classList.toggle('state-2');
    player.classList.add('transitioning');
    await playerReady();
    await waitForPlayerJump(itemBoxes[1]);
    const biomeSelection = getSelection(biomesSprite);
    setConfiguration('biome', biomeSelection);
    gameArea.classList.toggle('state-2');
    gameArea.classList.toggle('state-3');
    player.classList.add('transitioning');
    await playerReady();
    await waitForPlayerJump(itemBoxes[2]);
    const weatherSelection = getSelection(weatherSprite);
    setConfiguration('weather', weatherSelection);
    gameArea.classList.toggle('state-3');
    gameArea.classList.toggle('state-4');
    player.classList.add('transitioning');
}, { once: true })