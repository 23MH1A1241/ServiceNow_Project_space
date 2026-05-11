const axios = require('axios');

async function listModels() {
  const API_KEY = "AIzaSyB5lq-q-gt1gmsVv6pbqr7m5Br-brbyTzw";
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const models = res.data.models || [];
    const filtered = models.filter(m => m.name.includes('flash') || m.name.includes('pro'));
    console.log("MODELS:", JSON.stringify(filtered.map(m => m.name), null, 2));
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
  }
}

listModels();
