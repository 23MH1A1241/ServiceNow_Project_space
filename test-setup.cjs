const https = require('https');

const instance = 'dev296999';
const auth = 'Basic ' + Buffer.from('admin:CC3aYtxK$2l*').toString('base64');

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
    user_password: userData.username // Setting password same as username as per app logic
  });

  const options = {
    hostname: `${instance}.service-now.com`,
    path: '/api/now/table/sys_user',
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': data.length
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
        } catch(e) {
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

console.log('Starting user creation on dev296999...');
usersToCreate.forEach(createUser);
