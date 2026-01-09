import React from 'react'; class ErrorBoundary extends React.Component { constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; } static getDerivedStateFromError(error) { return { hasError: true }; } componentDidCatch(error, errorInfo) { this.setState({ error: error, errorInfo: errorInfo }); console.error('Error caught by boundary:', error, errorInfo); } render() { if (this.state.hasError) { const errorDetails = { timestamp: new Date().toISOString(), userAgent: navigator.userAgent, url: window.location.href, error: this.state.error, errorInfo: this.state.errorInfo };
  return (
    <div style={{ padding: '30px', margin: '20px', backgroundColor: '#fff5f5', border: '2px solid #fed7d7', borderRadius: '8px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
<div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
<div style={{ width: '24px', height: '24px', backgroundColor: '#e53e3e', borderRadius: '50%', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>!</div>
<h2 style={{ color: '#e53e3e', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Something went wrong!</h2>
</div>
<p style={{ color: '#4a5568', marginBottom: '20px', fontSize: '16px', lineHeight: '1.5' }}> An unexpected error occurred while rendering this component. The detailed error information below can help with troubleshooting. </p>
<div style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
<h3 style={{ color: '#2d3748', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Error Information</h3>
<div style={{ marginBottom: '12px' }}>
<strong style={{ color: '#4a5568' }}>Timestamp:</strong>
<span style={{ marginLeft: '8px', fontFamily: 'monospace', color: '#2d3748' }}>{errorDetails.timestamp}</span>
</div>
<div style={{ marginBottom: '12px' }}>
<strong style={{ color: '#4a5568' }}>Page URL:</strong>
<span style={{ marginLeft: '8px', fontFamily: 'monospace', color: '#2d3748', wordBreak: 'break-all' }}>{errorDetails.url}</span>
</div>
<div style={{ marginBottom: '12px' }}>
<strong style={{ color: '#4a5568' }}>Error Message:</strong>
<div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fed7d7', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#c53030', wordBreak: 'break-word' }}> {this.state.error && this.state.error.toString()
}
</div>
</div>
</div>
<details style={{ marginBottom: '16px' }}>
<summary style={{ cursor: 'pointer', padding: '12px', backgroundColor: '#edf2f7', border: '1px solid #cbd5e0', borderRadius: '6px', fontWeight: '600', color: '#2d3748', outline: 'none' }}>Component Stack Trace</summary>
<div style={{ marginTop: '8px', padding: '16px', backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', color: '#4a5568', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</div>
</details>
<details>
<summary style={{ cursor: 'pointer', padding: '12px', backgroundColor: '#edf2f7', border: '1px solid #cbd5e0', borderRadius: '6px', fontWeight: '600', color: '#2d3748', outline: 'none' }}>Browser Information</summary>
<div style={{ marginTop: '8px', padding: '16px', backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', color: '#4a5568', wordBreak: 'break-all' }}>{errorDetails.userAgent}</div>
</details>
<div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '6px' }}>
<h4 style={{ color: '#2b6cb0', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Troubleshooting Tips</h4>
<ul style={{ color: '#4a5568', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
<li>Check the browser console for additional error details</li>
<li>Verify that all required props are being passed correctly</li>
<li>Ensure all imported components and modules are available</li>
<li>Try refreshing the page to see if the error persists</li>
</ul>
</div>
</div> ); }
return this.props.children; } }

export default ErrorBoundary; 