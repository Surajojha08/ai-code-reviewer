const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize the Gemini SDK client using the key from our .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json()); // Allows our server to parse JSON payloads sent from React

// Core Code Review Endpoint
app.post('/api/review', async (req, res) => {
    const { code, language } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No code provided for review." });
    }

    // Constructing a robust system prompt tailored for high-impact resume evaluation
    const systemPrompt = `
You are an expert software engineer, DSA specialist, and cybersecurity auditor. 
Review the following code snippet written in ${language || 'a programming language'}.

Provide your entire response in structured, clean JSON format. Do not include markdown code block syntax around the JSON (like \`\`\`json). The output must strictly match this exact JSON schema:

{
  "metrics": {
    "bugsCount": 0, 
    "dsaPotential": "Low/Medium/High",
    "securityRisk": "Safe/Low/Medium/High"
  },
  "bugs": [
    "Detailed bullet point describing a logical error, edge case, or null-pointer issue."
  ],
  "dsa": {
    "currentComplexity": "e.g., O(N^2)",
    "optimizedComplexity": "e.g., O(N)",
    "explanation": "Detailed explanation of why the current code is unoptimized and how a better data structure (like HashMap, HashSet, Two-Pointers) improves it.",
    "refactoredCode": "Provide the complete, deeply optimized version of the code here."
  },
  "security": [
    "High/Medium/Low Severity: Explain the exact vulnerability (e.g., SQL injection, exposed inputs, broken access control) and how to remediate it."
  ]
}

Here is the code to review:
${code}
`;

    try {
        // Calling the Gemini 1.5 Flash model for lightning-fast analysis responses
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: systemPrompt,
        });

        const rawText = response.text.trim();
        
        // Parse the generated text directly into JSON to send clean data to React
        const parsedData = JSON.parse(rawText);
        res.json(parsedData);

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ 
            error: "Failed to generate code review. Please check your API configuration or verify the code syntax." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Code Review Backend running successfully on http://localhost:${PORT}`);
});
