import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

async function probe() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-pro-latest",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash"
    ];

    let results = "PROBE_RESULT_START\n";
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hi");
            results += `${modelName}: OK\n`;
        } catch (e) {
            const msg = e.message;
            if (msg.includes("429")) results += `${modelName}: 429\n`;
            else if (msg.includes("404")) results += `${modelName}: 404\n`;
            else results += `${modelName}: ERROR_${msg.substring(0, 30)}\n`;
        }
    }
    results += "PROBE_RESULT_END";
    fs.writeFileSync("probe_final_results.txt", results);
    console.log("Probe complete. Saved to probe_final_results.txt");
}

probe();
