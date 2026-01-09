import React, { useState, useEffect } from 'react';

const AdminDashboardDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    authStatus: 'checking...',
    apiResponse: null,
    error: null,
    topProducts: [],
    rawData: null
  });

  useEffect(() => {
    runDebugTests();
  }, []);

  const runDebugTests = async () => {
    console.log('🔍 Starting comprehensive admin dashboard debug...');
    
    try {
      // Test 1: Check authentication
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      setDebugInfo(prev => ({
        ...prev,
        authStatus: token ? `Token exists: ${token.substring(0, 20)}...` : 'No token found',
        userInfo: user
      }));

      if (!token) {
        setDebugInfo(prev => ({
          ...prev,
          error: 'No authentication token found in localStorage'
        }));
        return;
      }

      // Test 2: Make API call
      console.log('🔍 Making admin dashboard API call...');
      const response = await fetch(`http://localhost:5000/api/admin/dashboard?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('🔍 API Response:', data);

      setDebugInfo(prev => ({
        ...prev,
        apiResponse: data,
        rawData: JSON.stringify(data, null, 2)
      }));

      if (data.status === 'success') {
        const topProducts = data.data.topProducts || [];
        setDebugInfo(prev => ({
          ...prev,
          topProducts: topProducts
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          error: `API Error: ${data.message}`
        }));
      }

    } catch (error) {
      console.error('🔍 Debug test failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: `Network Error: ${error.message}`
      }));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5' }}>
      <h1>🔍 Admin Dashboard Debug Tool</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', border: '1px solid #ddd' }}>
        <h3>🔐 Authentication Status</h3>
        <p><strong>Status:</strong> {debugInfo.authStatus}</p>
        {debugInfo.userInfo && (
          <p><strong>User:</strong> {debugInfo.userInfo.email} ({debugInfo.userInfo.role})</p>
        )}
      </div>

      {debugInfo.error && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
          <h3>❌ Error</h3>
          <p>{debugInfo.error}</p>
        </div>
      )}

      {debugInfo.apiResponse && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', border: '1px solid #ddd' }}>
          <h3>📊 API Response Status</h3>
          <p><strong>Status:</strong> {debugInfo.apiResponse.status}</p>
          <p><strong>Message:</strong> {debugInfo.apiResponse.message || 'Success'}</p>
        </div>
      )}

      {debugInfo.topProducts.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
          <h3>🎯 Top Products ({debugInfo.topProducts.length} items)</h3>
          <ol>
            {debugInfo.topProducts.map((product, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{product.name}</strong><br />
                Sales: {product.salesCount} | Price: ₹{product.price}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDebugTests}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Re-run Debug Tests
        </button>
      </div>

      {debugInfo.rawData && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📋 Raw API Response</summary>
          <pre style={{ 
            backgroundColor: '#f8f8f8', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {debugInfo.rawData}
          </pre>
        </details>
      )}
    </div>
  );
};

export default AdminDashboardDebug;