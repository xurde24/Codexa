const { GoogleGenAI } = require("@google/genai");

const generateProblem = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GEMINI_KEY) {
            return res.status(500).json({ message: "Missing GEMINI_KEY environment variable" });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

        const systemInstruction = `
You are an expert Data Structures and Algorithms (DSA) problem setter for a platform similar to LeetCode. 
Your task is to generate a completely new coding problem based on the user's prompt. 
You MUST respond STRICTLY with a valid JSON object (no markdown formatting, no backticks, no comments) that exactly matches this schema:
{
  "title": "String (Problem Title)",
  "description": "String (Detailed problem description in Markdown/HTML. Include examples visually in the description)",
  "difficulty": "String (Must be exactly 'easy', 'medium', or 'hard')",
  "tags": ["String (Select 1 or more from: 'Basics', 'Arrays', 'Strings', 'Loops', 'Conditionals', 'Math', 'Sorting', 'Searching', 'Two Pointers', 'Hashing', 'Heap', 'Stack', 'Sliding Window', 'Linked List', 'Greedy')"],
  "visibleTestCases": [
    {
      "input": "String",
      "output": "String",
      "explanation": "String"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "String",
      "output": "String"
    }
  ],
  "startCode": [
    { "language": "C++", "initialCode": "String" },
    { "language": "Java", "initialCode": "String" },
    { "language": "JavaScript", "initialCode": "String" }
  ],
  "referenceSolution": [
    { "language": "C++", "completeCode": "String" },
    { "language": "Java", "completeCode": "String" },
    { "language": "JavaScript", "completeCode": "String" }
  ]
}

Rules:
1. Provide at 3 visibleTestCases.
2. Provide at 5 hiddenTestCases.
3. The 'startCode' array must contain exactly 3 objects with languages "C++", "Java", and "JavaScript".
4. The 'referenceSolution' array must contain exactly 3 objects with languages "C++", "Java", and "JavaScript".
5. The 'tags' array must contain 1 or more exact matches from: 'Basics', 'Arrays', 'Strings', 'Loops', 'Conditionals', 'Math', 'Sorting', 'Searching', 'Two Pointers', 'Hashing', 'Heap', 'Stack', 'Sliding Window', 'Linked List', 'Greedy'. Pick the closest matches if the user's prompt suggests a different topic.
6. Provide fully working and correct reference solutions.
7. Return ONLY JSON. Do not wrap it in \`\`\`json \`\`\`.
8. Generate beginner-friendly competitive programming problems using standard input/output.
9. Do NOT use class Solution, custom functions, vector<string>, vector<int>&, or LeetCode-style function signatures unless explicitly requested.
10. For C++, you MUST ALWAYS include the following exactly at the top of the code in both startCode and referenceSolution:
#include <iostream>
#include <bits/stdc++.h>
using namespace std;
11. Do NOT use advanced performance optimizations like std::ios_base::sync_with_stdio(false) or std::cin.tie(NULL). Do NOT include unnecessary headers like <limits> for simple comparisons.
12. For "easy" problems, write the most intuitive and beginner-friendly solution possible, avoiding complex STL functions or limits. Keep starter code minimal and clean.
13. The startCode and referenceSolution MUST contain a complete main() function (or equivalent entry point for Java/JS) with input handling and printing output to stdout, where the user should only need to write the solution logic inside main.
14. should put //code here in every refrence solution
15. EXTREMELY CRITICAL (Inputs): NEVER concatenate the array size with the first element of the array. If the array size is 6 and the first element is 4, you MUST write "6\\n4 ..." or "6 4 ...". Writing "64" is completely invalid. ALWAYS separate EVERY number with a space or a newline (\\n).
16. IMPORTANT (Code Formatting): Ensure single-line comments in startCode and referenceSolution DO NOT wrap to the next line without proper comment slashes (//). Keep comments concise. Keep the generated code extremely simple and readable.
17. IMPORTANT (Input Consistency): The \`startCode\` and \`referenceSolution\` MUST read the inputs in the exact same way. If the input starts with an array size N, both codes must read N first, and then use a loop of size N to read the array. DO NOT use "read until EOF" (e.g., \`while(cin >> num)\`) if an explicit size N is provided.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt || "Generate a random coding problem",
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });

        // The response text should already be valid JSON
        const rawJsonStr = response.text.trim();
        
        let problemData;
        try {
            problemData = JSON.parse(rawJsonStr);
        } catch (parseError) {
            console.error("AI returned invalid JSON:", rawJsonStr);
            return res.status(500).json({ message: "AI generated invalid JSON structure. Please try again." });
        }

        res.status(200).json({
            problem: problemData
        });

    } catch (err) {
        console.error("Error in generateProblem:", err);
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};

module.exports = generateProblem;
