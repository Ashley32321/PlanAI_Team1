require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /ask-gemini
app.post('/ask-gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({ reply: 'Gemini API error.' });
    }
});

// GET /get-data — fetch from public external API
app.get('/get-data', async (req, res) => {
    try {
        const apiUrl = 'https://api.example.com/data'; // Replace with actual API URL

        const response = await axios.get(apiUrl); // No API key or headers
        res.json(response.data);
    } catch (error) {
        console.error("External API error:", error.message);
        res.status(500).json({ error: 'Failed to fetch external data' });
    }
});

app.listen(3001, '127.0.0.1', () => {
    console.log("Server is running on http://localhost:3001");
});
