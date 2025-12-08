const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('No GEMINI_API_KEY found in .env or .env.local');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', json.error);
            } else {
                console.log('Available Models:');
                console.log(json.models?.map(m => `${m.name} (Supported: ${m.supportedGenerationMethods})`).join('\n') || 'No models found');
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            console.log('Raw response:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request error:', e);
});
