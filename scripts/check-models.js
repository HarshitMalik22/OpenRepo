require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No GEMINI_API_KEY found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Note: The specific method to list models might depend on the SDK version,
        // but typically it's on the client or model factory.
        // If specifically using the fetch endpoint:
        console.log('Fetching models via REST API to be sure...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`Failed to list models: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log('Available Models (Gemini only):');
        const geminiModels = data.models.filter(m => m.name.includes('gemini'));
        geminiModels.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
        });

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
