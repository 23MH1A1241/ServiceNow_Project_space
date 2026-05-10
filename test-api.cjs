const https = require('https');
require('dotenv').config();

const url = 'https://dev296999.service-now.com/api/now/table/incident?sysparm_limit=1';
const auth = 'Basic ' + Buffer.from(`${process.env.SN_USERNAME}:${process.env.SN_PASSWORD}`).toString('base64');

const req = https.request(url, {
  method: 'GET',
  headers: {
    'Authorization': auth,
    'Accept': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
  });
});

req.end();
