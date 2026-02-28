import { GoogleGenerativeAI } from "@google/generative-ai";

async function probe() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-pro-latest",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash"
    ];

    console.log("PROBE_START");
    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hi");
            console.log(`OK: ${modelName}`);
            break;
        } catch (e) {
            console.log(`FAIL: ${modelName} - ${e.message}`);
        }
    }
    console.log("PROBE_END");
}

probe();
