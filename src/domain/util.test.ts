// 1) Run the following to generate a coverage report:
// $ npm test -- --coverage .
//
// 2) Then open up `coverage/lcov-report/index.html` in the browser

import { getResultEmoji, isNameCorrect, isGroupCorrect, isOriginCorrect, isSizeCorrect } from "./util";
import { breeds } from './breeds.mapping';
// import puppeteer from "puppeteer";

const target = breeds.find((b) => b.code === "french_bulldog");
const frenchBulldog = {
    code: "french_bulldog",
    name: "French Bulldog",
    group: 7,
    origin: ["FR"],
    size: [1],
    correct: true,
};
const poodle = {
    code: "poodle",
    name: "Poodle",
    group: 7,
    origin: ["FR", "DE"],
    size: [1, 2],
    correct: false,
};
const goldenRetriever = {
    code: "golden_retriever",
    name: "Golden Retriever",
    group: 3,
    origin: ["GB"],
    size: [2],
    correct: false,
};

test('should display correct emoji', () => {
    // Incorrect test
    const emojiIncorrect = getResultEmoji(poodle, target);
    expect(emojiIncorrect).toBe("❌");

    // Correct test
    const emojiCorrect = getResultEmoji(frenchBulldog, target);
    expect(emojiCorrect).toBe("✅");

    // Undefined test
    const undef = getResultEmoji(undefined, undefined);
    expect(undef).toBe("");
});

test('should match breed name', () => {
    // Incorrect test
    const resultIncorrect = isNameCorrect(poodle, target);
    expect(resultIncorrect).toBe(false);

    // Correct test
    const resultCorrect = isNameCorrect(frenchBulldog, target);
    expect(resultCorrect).toBe(true);

    // Undefined test
    const undef = isNameCorrect(undefined, undefined);
    expect(undef).toBe(false);
});

test('should match breed group', () => {
    // Incorrect test
    const resultIncorrect = isGroupCorrect(goldenRetriever, target);
    expect(resultIncorrect).toBe(false);

    // Correct test
    const resultCorrect = isGroupCorrect(poodle, target);
    expect(resultCorrect).toBe(true);

    // Undefined test
    const undef = isGroupCorrect(undefined, undefined);
    expect(undef).toBe(false);
});

test('should match breed origin', () => {
    // Incorrect test
    const resultIncorrect = isOriginCorrect(goldenRetriever.origin[0], target?.origin);
    expect(resultIncorrect).toBe(false);

    // Correct test
    const resultCorrect = isOriginCorrect(poodle.origin[0], target?.origin);
    expect(resultCorrect).toBe(true);

    // Undefined test
    const undef = isOriginCorrect(undefined, undefined);
    expect(undef).toBe(false);
});

test('should match breed size', () => {
    // Incorrect test
    const resultIncorrect = isSizeCorrect(goldenRetriever.size[0], target?.size);
    expect(resultIncorrect).toBe(false);

    // Correct test
    const resultCorrect = isSizeCorrect(poodle.size[0], target?.size);
    expect(resultCorrect).toBe(true);

    // Undefined test
    const undef = isSizeCorrect(undefined, undefined);
    expect(undef).toBe(false);
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