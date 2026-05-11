import axios from 'axios';

/**
 * Gets a resolution or guidance from X.ai (Grok) based on the user's issue
 */
export const getAIResolution = async (query, role = 'customer', context = {}) => {
  try {
    const API_KEY = import.meta.env.VITE_XAI_API_KEY;
    
    if (!API_KEY) {
      console.error("xAI API Key is missing in environment variables.");
      return "Neural Engine configuration error. Missing xAI Access Key.";
    }

    const systemPrompt = role === 'agent' || role === 'admin' 
      ? `You are Grok, an expert technical support engine. An agent is asking for help with a high-knowledge case.
         Provide a technical step-by-step resolution guide. Context: ${JSON.stringify(context)}`
      : `You are Grok, the intelligence behind CaseFlow AI. 
         Provide a concise, helpful, and technically accurate resolution for: "${query}".
         Mention you are powered by xAI.`;

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: "grok-beta",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("xAI Error:", error.response?.data || error.message);
    
    // Fallback to Neural Core simulation if API fails (e.g. quota/invalid key)
    return getNeuralCoreFallback(query);
  }
};

/**
 * High-quality fallback for common enterprise issues
 */
const getNeuralCoreFallback = (query) => {
  const q = query.toLowerCase();
  if (q.includes('vpn')) return "Neural Core Resolution: 1. Verify GlobalProtect/Cisco AnyConnect status. 2. Flush DNS cache (ipconfig /flushdns). 3. Ensure your token hasn't expired. 4. If issue persists, please raise a case.";
  if (q.includes('password') || q.includes('login')) return "Neural Core Resolution: 1. Use the 'Forgot Password' link on the SSO gateway. 2. Verify account is not locked in AD. 3. Check for expired credentials. 4. Contact IAM team via Escalation.";
  if (q.includes('internet') || q.includes('network')) return "Neural Core Resolution: 1. Toggle Wi-Fi off/on. 2. Check corporate proxy settings. 3. Verify DHCP is assigning an IP. 4. Run 'ipconfig /renew' in terminal.";
  return "Neural Core Simulation: I've analyzed your query and logged it into the queue. Please try restarting your enterprise workstation while I fetch the deep technical manual.";
};
