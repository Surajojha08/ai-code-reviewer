const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();

// This unlocks the door so your Vercel frontend can talk to this backend!
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/', (req, res) => {
    res.send('AI Code Reviewer Backend is Running Successfully!');
});

app.post('/api/review', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).send('No code provided');
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Review the following code. Identify bugs, optimization opportunities, and provide clean code suggestions:\n\n${code}`,
        });

        res.send(response.text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error during review');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});