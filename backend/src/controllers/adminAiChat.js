const { GoogleGenAI } = require("@google/genai");

const adminAiChat = async (req, res) => {
    try {
        const { messages, formData } = req.body;

        if (!process.env.GEMINI_KEY) {
            return res.status(500).json({ message: "Missing GEMINI_KEY environment variable" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

        const systemInstruction = `
You are an expert Data Structures and Algorithms (DSA) Problem Setter Assistant. 
Your role is to help the platform administrator create, refine, and configure coding problems for the platform.

## CURRENT PROBLEM STATE (LIVE FORM DATA):
${JSON.stringify(formData, null, 2)}

## YOUR CAPABILITIES:
1. Review the problem description and suggest improvements for clarity and formatting.
2. Generate edge cases and additional test cases (both visible and hidden).
3. Provide or fix starter code (C++, Java, JavaScript) to ensure it compiles correctly and reads input properly.
4. Provide or fix reference solutions (C++, Java, JavaScript).
5. Suggest appropriate tags and difficulty levels.

## INTERACTION GUIDELINES:
- You MUST respond STRICTLY with a valid JSON object. Do not wrap it in markdown block quotes or add any extra text outside the JSON.
- The JSON object must match this schema exactly:
  {
    "message": "String (Your conversational response, formatted in Markdown, explaining what you analyzed or changed.)",
    "updates": {
      // ONLY include keys here if you are applying changes to the form. Omit keys if no changes are made.
      "title": "String",
      "description": "String",
      "difficulty": "String (easy, medium, or hard)",
      "tags": ["String"],
      "visibleTestCases": [ { "input": "String", "output": "String", "explanation": "String" } ],
      "hiddenTestCases": [ { "input": "String", "output": "String" } ],
      "startCode": [ { "language": "String (C++, Java, JavaScript)", "initialCode": "String" } ],
      "referenceSolution": [ { "language": "String (C++, Java, JavaScript)", "completeCode": "String" } ]
    }
  }
- IMPORTANT: If the user asks you to modify, rewrite, generate, or fix something that belongs in the form fields (like adding testcases or rewriting the description), you MUST include those changes inside the "updates" object so the frontend can automatically apply them.
- If no changes are needed to the form, the "updates" object can be empty {}.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: messages,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });
        
        const rawJsonStr = response.text.trim();
        let aiData;
        try {
            aiData = JSON.parse(rawJsonStr);
        } catch(e) {
            aiData = { message: rawJsonStr, updates: {} };
        }

        res.status(201).json(aiData);

    } catch (err) {
        console.error("Error in adminAiChat:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = adminAiChat;
