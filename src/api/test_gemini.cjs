const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const API_KEY = "AIzaSyB5lq-q-gt1gmsVv6pbqr7m5Br-brbyTzw";
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello, are you active?");
    const response = await result.response;
    console.log("SUCCESS:", response.text());
  } catch (error) {
    console.error("FAILURE:", error.message);
  }
}

test();
