/**
 * test-setup.cjs
 * Creates test users in the ServiceNow dev instance.
 * Credentials are read from the .env file via dotenv — never hardcoded.
 *
 * Usage: node test-setup.cjs
 * Requires: SN_USERNAME and SN_PASSWORD set in .env
 */
require('dotenv').config();
const https = require('https');

const instance = process.env.SN_INSTANCE || 'dev296999';
const username = process.env.SN_USERNAME;
const password = process.env.SN_PASSWORD;

if (!username || !password) {
  console.error('ERROR: SN_USERNAME and SN_PASSWORD must be set in your .env file.');
  console.error('Copy .env.example to .env and fill in your credentials.');
  process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

const usersToCreate = [
  { username: 'vinay', name: 'Vinay User', email: 'vinay@example.com' },
  { username: 'agent1', name: 'Support Agent 1', email: 'agent1@example.com' },
  { username: 'supervisor1', name: 'Support Supervisor 1', email: 'supervisor1@example.com' }
];

function createUser(userData) {
  const data = JSON.stringify({
    user_name: userData.username,
    first_name: userData.name.split(' ')[0],
    last_name: userData.name.split(' ').slice(1).join(' ') || 'User',
    email: userData.email,
    active: true,
    user_password: userData.username
  });

  const options = {
    hostname: `${instance}.service-now.com`,
    path: '/api/now/table/sys_user',
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`User ${userData.username}: Status ${res.statusCode}`);
      if (res.statusCode !== 201) {
        try {
          const parsed = JSON.parse(body);
          console.log(`Error: ${parsed.error ? parsed.error.message : body}`);
        } catch (e) {
          console.log(`Response: ${body}`);
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error for ${userData.username}: ${e.message}`);
  });

  req.write(data);
  req.end();
}

console.log(`Starting user creation on ${instance}...`);
usersToCreate.forEach(createUser);
