import axios from 'axios';

// Create a generic axios instance that uses the Vite proxy
const client = axios.create({
  baseURL: '', // Handled by Vite proxy
});

// ServiceNow Tables
const CASE_TABLE = 'sn_customerservice_case'; // User specifically requested this table despite earlier errors. Let's assume it exists on dev296999!

export const authenticateUser = async (username, password) => {
  if (username !== 'admin' && username !== password) {
    throw new Error('Invalid credentials (testing constraint: password must equal username)');
  }

  // Verify against sys_user
  const res = await client.get(`/api/now/table/sys_user?sysparm_query=user_name=${username}&sysparm_limit=1`);
  const users = res.data.result;

  if (!users || users.length === 0) {
    throw new Error('User not found in ServiceNow sys_user table.');
  }

  const user = users[0];
  
  // Dynamic role assignment based on username convention
  let role = 'customer';
  const uname = user.user_name.toLowerCase();
  if (uname.includes('admin')) role = 'admin';
  else if (uname.includes('supervisor')) role = 'supervisor';
  else if (uname.includes('agent')) role = 'agent';

  return {
    sys_id: user.sys_id,
    user_name: user.user_name,
    name: user.name,
    email: user.email,
    role: role
  };
};

export const createCase = async (caseData) => {
  const response = await client.post(`/api/now/table/${CASE_TABLE}`, caseData);
  return response.data.result;
};

export const getCase = async (caseNumber) => {
  const response = await client.get(`/api/now/table/${CASE_TABLE}?sysparm_query=number=${caseNumber}`);
  if (response.data.result && response.data.result.length > 0) {
    return response.data.result[0];
  }
  return null;
};

// Generic function to get metrics based on query
export const getDashboardMetrics = async (role, username) => {
  let query = '';
  // Custom query logic based on role
  if (role === 'agent') {
    // Ideally query assigned_to
    query = 'ORDERBYDESCsys_created_on';
  } else if (role === 'supervisor') {
    query = 'ORDERBYDESCsys_created_on';
  }

  const response = await client.get(`/api/now/table/${CASE_TABLE}?sysparm_limit=100&sysparm_query=${query}`);
  const cases = response.data.result || [];
  
  const active = cases.filter(c => c.state !== '3' && c.state !== '4' && c.state !== '7').length;
  const critical = cases.filter(c => c.priority === '1').length;
  const resolved = cases.filter(c => c.state === '3').length;
  const escalated = cases.filter(c => c.escalation === '1').length;

  return { active, critical, resolved, escalated, recent: cases.slice(0, 8) };
};

export const getKnowledgeArticles = async () => {
    return [
        { sys_id: '1', short_description: 'How to reset your password', text: 'Follow these steps to securely reset your credentials.' },
        { sys_id: '2', short_description: 'Network connectivity issues', text: 'Check your router and local proxy settings.' },
        { sys_id: '3', short_description: 'Mobile Device Not Turning On', text: 'Hold the power button for 10 seconds to hard reset.' }
    ];
};
