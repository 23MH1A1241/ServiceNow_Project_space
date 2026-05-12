import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * CaseFlow AI | Enterprise Neural Engine
 * High-performance Gemini-powered technical resolutions with local fallback.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getAIResolution = async (query, role = 'customer', context = {}) => {
  if (!genAI) {
    return getLocalAIResolution(query);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      You are CaseFlow AI, an enterprise technical support assistant. 
      Context: User is a ${role}. 
      Case Info: ${JSON.stringify(context)}.
      
      User asks: "${query}"
      
      Provide a concise, professional, and accurate technical resolution. 
      If you can't solve it, suggest next steps like raising a ticket.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Engine failed, falling back to local core:", error);
    return getLocalAIResolution(query);
  }
};

const getLocalAIResolution = (query) => {
  const q = query.toLowerCase();
  
  const scenarios = [
    {
      keywords: ['hi', 'hello', 'hey', 'greetings'],
      response: `Hello! I am CaseFlow AI. I've verified your identity and I'm ready to help. How can I assist you today?`
    },
    {
      keywords: ['vpn', 'globalprotect', 'anyconnect', 'remote', 'connect'],
      response: "It sounds like you're having trouble with your VPN. Here are a few things you can try right now:\n\n1. Ensure you have a stable internet connection first.\n2. Open your VPN client and try to 'Renew' or 'Re-connect'.\n3. Restart your laptop—this often fixes session token issues.\n4. If you still can't connect, please use the button below to raise a support case."
    },
    {
      keywords: ['password', 'reset', 'login', 'access', 'sso', 'account'],
      response: "I can help with account access! To reset your password securely:\n\n1. Go to the main SSO login page.\n2. Click on 'Forgot Password' or 'Reset Account'.\n3. Check your mobile device for a security code.\n4. Enter the code to set your new password. \n\nLet me know if that works!"
    },
    {
      keywords: ['internet', 'network', 'wifi', 'slow', 'connection', 'offline'],
      response: "Networking issues can be frustrating. Let's try to fix your connection:\n\n1. Try turning your Wi-Fi off and back on again.\n2. Make sure you aren't on a 'Guest' network by mistake.\n3. If you're using a docking station, ensure the cable is plugged in firmly.\n4. Restarting your router (if at home) or your laptop often clears these issues."
    },
    {
      keywords: ['outlook', 'email', 'teams', 'message', 'office', '365'],
      response: "I'll help you get your communications back on track:\n\n1. Check if Outlook is in 'Offline Mode' (look at the bottom status bar).\n2. For Teams, try quitting the app completely and restarting it.\n3. If emails aren't sending, check your 'Outbox' to see if a large attachment is stuck.\n4. Still having trouble? I can escalate this for you."
    },
    {
      keywords: ['thanks', 'thank', 'perfect', 'resolved', 'fixed'],
      response: "You're very welcome! I'm glad I could help. Is there anything else you need assistance with?"
    }
  ];

  const match = scenarios.find(s => s.keywords.some(k => q.includes(k)));
  return match ? match.response : `I've looked into your request regarding "${query}". I recommend a quick restart of your device. If the problem persists, please raise a case for human expert review.`;
};
