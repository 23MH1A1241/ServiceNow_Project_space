const https = require('https');
require('dotenv').config();

function checkUser(username) {
  const url = `https://dev296999.service-now.com/api/now/table/sys_user?sysparm_query=user_name=${username}&sysparm_limit=1`;
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
      try {
        const parsed = JSON.parse(data);
        if (parsed.result && parsed.result.length > 0) {
          console.log(`User ${username} exists!`);
        } else {
          console.log(`User ${username} DOES NOT EXIST in sys_user.`);
        }
      } catch(e) {
        console.error(e);
      }
    });
  });

  req.end();
}

checkUser('vinay');
checkUser('agent1');
checkUser('supervisor1');
checkUser('admin');
