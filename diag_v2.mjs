import fs from 'fs';
async function diag() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            const names = data.models.map(m => m.name.replace("models/", ""));
            fs.writeFileSync("full_model_list.txt", names.join("\n"));
            console.log("Saved " + names.length + " models to full_model_list.txt");
        } else {
            console.log("ERROR: " + JSON.stringify(data));
        }
    } catch (e) {
        console.log("FETCH_ERROR: " + e.message);
    }
}
diag();
