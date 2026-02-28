import { GoogleGenerativeAI } from "@google/generative-ai";

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

    console.log("PROBE_RESULT_START");
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hi");
            console.log(`${modelName}: OK`);
        } catch (e) {
            const msg = e.message;
            if (msg.includes("429")) console.log(`${modelName}: 429_QUOTA`);
            else if (msg.includes("404")) console.log(`${modelName}: 404_NOT_FOUND`);
            else console.log(`${modelName}: ERROR_${msg.substring(0, 30)}`);
        }
    }
    console.log("PROBE_RESULT_END");
}

probe();
