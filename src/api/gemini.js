import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Gets a resolution or guidance from Gemini AI based on the user's issue
 */
export const getAIResolution = async (query, role = 'customer', context = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (role === 'agent' || role === 'admin') {
      prompt = `You are an expert technical support engineer. An agent is asking for help with a high-knowledge case.
      Case Context: ${JSON.stringify(context)}
      User Query: ${query}
      Provide a step-by-step resolution guide for the agent. Keep it professional, concise, and technical.`;
    } else {
      prompt = `You are CaseFlow AI, an intelligent customer support assistant. 
      User Query: ${query}
      Provide a helpful, friendly, and concise resolution. If it's a technical issue, provide clear troubleshooting steps. 
      Mention that you are powered by CaseFlow Neural Engine.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting to my neural processing unit. Please try again in a moment.";
  }
};
