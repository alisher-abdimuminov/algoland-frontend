import { createCanvas } from 'canvas';
import color from "tinycolor2";

async function hash(str: string): Promise<number> {
    let sum = 0;
    const buffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str))
    for (const n of new Uint8Array(buffer)) {
        sum += n;
    }
    return sum;
}

async function hue(str: string): Promise<number> {
    const n = await hash(str);
    return n % 360;
}

async function generateGradient(username: string) {
    const h = await hue(username);
    const c1 = color({ h, s: 0.95, l: 0.5 });
    const second = c1.triad()[1].toHexString();

    return {
        fromColor: c1.toHexString(),
        toColor: second,
    };
}

export default defineEventHandler(async (event) => {
    const { username } = event.context.params || { username: "?" };
    const width = 120;
    const height = 120;

    const { fromColor, toColor } = await generateGradient(username);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Gradient yaratish
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, fromColor);
    gradient.addColorStop(1, toColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Rasmni PNG formatda qaytarish
    const buffer = canvas.toBuffer('image/png');

    setResponseHeaders(event, {
        'Content-Type': 'image/png'
    });

    return buffer;
});
