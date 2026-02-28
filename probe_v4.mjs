import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

async function probe() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-pro-latest",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash-lite-preview-09-2024"
    ];

    let results = "PROBE_V4_START\n";
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hi");
            results += `${modelName}: OK\n`;
        } catch (e) {
            results += `${modelName}: ${e.message.substring(0, 50)}\n`;
        }
    }
    fs.writeFileSync("probe_v4_results.txt", results);
}

probe();
