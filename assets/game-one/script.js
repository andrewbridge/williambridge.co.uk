const screen = document.getElementById('screen1');
const gameArea = screen.querySelector('.game-area');
const instructions = screen.querySelector('.instructions');
const player = screen.querySelector('.player');
const itemBoxes = screen.querySelectorAll('.item-box');

const waitForPlayerJump = () => {
    gameArea.addEventListener('click', () => player.classList.add('jump'), { once: true });
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
    await waitForPlayerJump();
    gameArea.classList.toggle('state-1');
    gameArea.classList.toggle('state-2');
    player.classList.add('transitioning');
    await playerReady();
    await waitForPlayerJump();
    gameArea.classList.toggle('state-2');
    gameArea.classList.toggle('state-3');
    player.classList.add('transitioning');
    await playerReady();
    await waitForPlayerJump();
    gameArea.classList.toggle('state-3');
    gameArea.classList.toggle('state-4');
    player.classList.add('transitioning');
}, { once: true })