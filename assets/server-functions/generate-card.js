import { serve } from "https://deno.land/std/http/server.ts";
import OpenAI from "https://deno.land/x/openai/mod.ts";
import { parseConfiguration } from "../configuration-collector.mjs";

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "https://williambridge.co.uk");
    headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        return new Response(null, { headers });
    }

    if (!req.body) {
        return new Response('No body', { status: 400, headers });
    }
    const configurationString = await req.text();
    let config = null;
    try {
        config = parseConfiguration(configurationString);
    } catch (error) {
        return new Response(`Error while parsing configuration: ${error.message}`, { status: 400, headers });
    }
    const { animal, biome, weather, slot_machine_score, tap_score  } = config;
    let prompt = `I want to produce an image for the front of a birthday card.
The birthday card should have the text "HAPPY BIRTHDAY" prominently on the card.
The scene should have a ${biome} theme, and the weather should be ${weather}.
The centre piece of the image should be of an anthropomorphised ${animal}, enjoying its birthday.`;
    let model = 'dall-e-2';
    if (tap_score < 10) {
        prompt += `\nThe image should look purposely bad, almost Lovecraftian. Don't put a lot of effort in`;
    } else if (tap_score >= 10 && tap_score < 30) {
        prompt += `\nThe image should look rough around the edges, some elements of the image should be purposely incorrect.`;
    } else if (tap_score >= 60 ) {
        prompt += `\nThe image should look really polished. The user is going to tip $200 for the perfect image.`;
    }
    if (slot_machine_score < 1000) {
        prompt += `\nThe image should have a dangerous, disheveled look.`;
    } else if (slot_machine_score >= 1000 && slot_machine_score < 5000) {
        prompt += `\nThe image should have a plain, unassuming look. Nothing flashy.`;
    } else if (slot_machine_score >= 7000 && slot_machine_score < 9999) {
        prompt += `\nThe image should have a flashy, expensive look. Splash the cash.`;
    } else if (slot_machine_score === 9999) {
        prompt += `\nThe image should be kingly, there should be exorbitant wealth surrounding the ${animal}, who should be wearing a crown.`;
    }
    if (tap_score > 50 && slot_machine_score > 7000) {
        model = 'dall-e-3';
    }
    const { data: [image] } = await openai.images.generate({ model, prompt });
    return new Response(JSON.stringify(image), { headers });
});
