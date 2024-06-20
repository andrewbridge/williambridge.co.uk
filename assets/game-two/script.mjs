import { setConfiguration } from "../configuration-collector.mjs";
import { AsyncWaiter, createReactive, debounce } from "../utilities.mjs";

const bgmCheckbox = document.getElementById('bgm-check');
const sfxCheckbox = document.getElementById('sfx-check');
const screen = document.getElementById('screen2');
const gameArea = screen.querySelector('.game-area');
const instructions = screen.querySelector('.instructions');
const bestScore = screen.querySelector('.best.score span');
const currentScore = screen.querySelector('.current.score span');
const slots = screen.querySelector('.slot-frame');
const carousels = screen.querySelectorAll('.carousel');
const scrollPrompt = screen.querySelector('.scroll-prompt');
const bgmAudio = screen.querySelector('audio.bgm');
const leverAudio = screen.querySelector('audio.lever');
const slotAudios = [
    screen.querySelector('audio.slot_1'),
    screen.querySelector('audio.slot_2'),
    screen.querySelector('audio.slot_3'),
];

bgmCheckbox.addEventListener('change', () => {
    bgmAudio.muted = !bgmCheckbox.checked;
});
sfxCheckbox.addEventListener('change', () => {
    leverAudio.muted = !sfxCheckbox.checked;
    slotAudios.forEach(audio => audio.muted = !sfxCheckbox.checked);
});

function isCenterScrolledIntoView(elem) {
    const rect = elem.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;

    const elemCenterX = rect.left + rect.width / 2;
    const elemCenterY = rect.top + rect.height / 2;

    const horizontallyInView = elemCenterX >= 0 && elemCenterX <= viewWidth;
    const verticallyInView = elemCenterY >= 0 && elemCenterY <= viewHeight;

    return horizontallyInView && verticallyInView;
}

// Debounced scroll event handler
const debouncedOnScroll = debounce(() => {
    if (gameArea.classList.contains('playing') && isCenterScrolledIntoView(screen)) {
        console.log('playing');
        bgmAudio.play();
    } else {
        console.log('pausing');
        bgmAudio.pause();
    }
}, 100);

// Attach the debounced scroll event handler to the window scroll event
window.addEventListener('scroll', debouncedOnScroll, false);

instructions.addEventListener('click', () => {
    bgmAudio.play();
    gameArea.classList.add('playing');
}, { once: true });

const symbols = [
    { symbol: 'diamond', weight: 1, score: 3333 },
    { symbol: 'emerald', weight: 2, score: 3299 },
    { symbol: 'sapphire', weight: 3, score: 3266 },
    { symbol: 'ruby', weight: 4, score: 3234 },
    { symbol: 'amethyst', weight: 5, score: 3203 },
    { symbol: 'purple-potion', weight: 6, score: 2222 },
    { symbol: 'red-potion', weight: 7, score: 2188 },
    { symbol: 'blue-potion', weight: 8, score: 2155 },
    { symbol: 'gold-coin', weight: 9, score: 1111 },
    { symbol: 'silver-coin', weight: 10, score: 555 },
    { symbol: 'bronze-coin', weight: 11, score: 222 }
];

const allSymbols = symbols.map(({ symbol }) => symbol);

/**
 * Get a symbol "randomly", with a bias towards symbols with a higher weight.
 * 
 * This method was entirely provided by ChatGPT 4o, and came with the following description:
 * 
 * "The random number is used to select a symbol. We iterate through the symbols, subtracting their weights from the random number until it falls below zero, indicating the chosen symbol.""
 * 
 *  */
const selectSymbol = () => {
    const totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
    let randomNum = Math.random() * totalWeight;
  
    for (let i = 0; i < symbols.length; i++) {
      randomNum -= symbols[i].weight;
      if (randomNum < 0) {
        return symbols[i];
      }
    }
}

const bestScoreValue = createReactive(0);
const currentScoreValue = createReactive(0);

bestScoreValue.subscribe((value) => bestScore.textContent = value);
currentScoreValue.subscribe((value) => currentScore.textContent = value);

const pullHandler = async () => {
    setConfiguration('slot machine score', '0000');
    const awaiter = AsyncWaiter();
    const leverPulled = awaiter.getAwaiter();
    slots.addEventListener('animationend', () => {
        slots.classList.remove('pull-lever');
        leverPulled();
    }, { once: true });
    leverAudio.pause();
    leverAudio.currentTime = 0;
    slotAudios.forEach((slotAudio) => {
        slotAudio.pause();
        slotAudio.currentTime = 0
    });
    slots.classList.add('pull-lever');
    leverAudio.play();
    currentScoreValue.value = 0;
    var hiddenCurrentScore = 0;
    carousels.forEach((carousel, index) => {
        carousel.classList.remove(...allSymbols);
        carousel.classList.remove('finish');
        carousel.classList.add('spin');
        const { symbol, score } = selectSymbol();
        hiddenCurrentScore += score;
        carousel.classList.add(symbol);
        const carouselFinished = awaiter.getAwaiter();
        setTimeout(() => {
            carousel.classList.remove('spin');
            carousel.classList.add('finish');
            slotAudios[index].play();
            carouselFinished();
        }, 2000 + (500 * index));
    });
    await awaiter.awaitAll();
    currentScoreValue.value = hiddenCurrentScore;
    setConfiguration('slot machine score', String(hiddenCurrentScore).padStart(4, '0'));
    if (hiddenCurrentScore > bestScoreValue.value) {
        bestScoreValue.value = hiddenCurrentScore;
    }
    scrollPrompt.classList.add('shown');
    slots.addEventListener('click', pullHandler, { once: true });
}
slots.addEventListener('click', pullHandler, { once: true });