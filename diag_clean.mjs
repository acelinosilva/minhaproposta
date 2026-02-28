async function diag() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("MODELS_START");
            data.models.forEach(m => console.log(m.name.replace("models/", "")));
            console.log("MODELS_END");
        } else {
            console.log("ERROR: " + JSON.stringify(data));
        }
    } catch (e) {
        console.log("FETCH_ERROR: " + e.message);
    }
}
diag();
