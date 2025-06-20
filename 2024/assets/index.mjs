import { getConfiguration } from "./configuration-collector.mjs";

const generationScreen = document.getElementById('screen4');
const instructions = generationScreen.querySelector('.instructions');
const generateButton = generationScreen.querySelector('#generate-button');
const finalImage = generationScreen.querySelector('#final_image');

generateButton.addEventListener('click', async () => {
    instructions.classList.toggle('state-1');
    instructions.classList.toggle('state-2');
    try {
        const response = await fetch('https://williambridge-2024-zgsngq9zxkda.deno.dev', { method: 'POST', body: getConfiguration() });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const { url } = await response.json();
        finalImage.src = url;
        instructions.classList.add('hidden');
    } catch (error) {
        console.error(error);
        instructions.classList.toggle('state-2');
        instructions.classList.toggle('state-3');
    }
});