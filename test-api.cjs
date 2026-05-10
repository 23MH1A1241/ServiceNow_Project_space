const https = require('https');

const url = 'https://dev378530.service-now.com/api/now/table/incident?sysparm_limit=1';
const auth = 'Basic ' + Buffer.from('admin:n7gkBC0WR*z+').toString('base64');

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
