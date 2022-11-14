import { getResultEmoji } from "./util";
import { breeds } from './breeds.mapping';
import puppeteer from "puppeteer";

test('should display correct emoji', () => {
    const exampleTarget = breeds.find((b) => b.code === "french_bulldog");
    const correctGuess = {
        code: "french_bulldog",
        name: "French Bulldog",
        group: 7,
        origin: ["FR"],
        size: [1],
        correct: true,
    };
    const incorrectGuess = {
        code: "poodle",
        name: "Poodle",
        group: 7,
        origin: ["FR", "DE"],
        size: [1, 2],
        correct: false,
      };
    
    // Incorrect test
    const emojiIncorrect = getResultEmoji(incorrectGuess, exampleTarget);
    expect(emojiIncorrect).toBe("❌");

    // Correct test
    const emojiCorrect = getResultEmoji(correctGuess, exampleTarget);
    expect(emojiCorrect).toBe("✅");
});

// The following code has a bug:
// https://pptr.dev/troubleshooting/
// test('should make an incorrect guess', async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         slowMo: 80,
//         args: ['--window-size=1920,1080'],
//     });
//     const page = await browser.newPage();
//     await page.goto('public/index.html');
// })