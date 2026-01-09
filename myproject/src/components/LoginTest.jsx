import React, { useState } from 'react';
import { authAPI } from '../utils/api';
const LoginTest = () => {
  ;
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const testLogin = async () => {
    setLoading(true); setResult('Testing...');
    try {
      console.log('Testing direct API call...');
      const response = await authAPI.login('admin@soundsaccessories.com', 'admin123456');
      console.log('API Response:', response); setResult(`SUCCESS: ${JSON.stringify(response, null, 2)
        }`);
    } catch (error) { console.error('API Error:', error); setResult(`ERROR: ${error.message}`); } finally { setLoading(false); }
  };
  const testFetch = async () => {
    setLoading(true); setResult('Testing direct fetch...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@soundsaccessories.com', password: 'admin123456' })
      });
      const data = await response.json(); console.log('Direct fetch response:', data); setResult(`FETCH SUCCESS: ${JSON.stringify(data, null, 2)
        }`);
    } catch (error) { console.error('Fetch error:', error); setResult(`FETCH ERROR: ${error.message}`); } finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Login API Test</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}> Test AuthAPI Login </button>
        <button onClick={testFetch} disabled={loading}> Test Direct Fetch </button>
      </div>
      <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>{result}</div>
    </div>
  );
};

export default LoginTest;