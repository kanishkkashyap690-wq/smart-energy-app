import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Dashboard from './Dashboard';
import { Scan, LayoutDashboard } from 'lucide-react';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [view, setView] = useState('scanner');
  const [allScans, setAllScans] = useState([]);
  const [vendorName, setVendorName] = useState(''); // Vendor name state add kiya

  // Database se purana data fetch karne ke liye
  useEffect(() => {
    fetch('https://smart-energy-app-bbac.onrender.com/api/scans')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          qrData: item.qrData,
          vendor: item.vendor || 'Unknown', // Vendor field handle kiya
          time: new Date(item.createdAt).toLocaleTimeString()
        }));
        setAllScans(formattedData);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  useEffect(() => {
    if (view === 'scanner') {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      });

      scanner.render(success, error);

      function success(result) {
        scanner.clear();
        setScanResult(result);

        const newEntry = {
          qrData: result,
          vendor: vendorName || 'Unknown Vendor', // Vendor name entry mein add kiya
          time: new Date().toLocaleTimeString()
        };
        setAllScans(prev => [newEntry, ...prev]);

        // Backend API Call with Vendor Name
        fetch('https://smart-energy-app-bbac.onrender.com/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrData: result,
            vendor: vendorName || 'Unknown Vendor'
          }),
        })
        .then(res => res.json())
        .catch(err => console.error("Database Error:", err));
      }

      function error(err) { /* Ignore */ }
      return () => scanner.clear();
    }
  }, [view, vendorName]);

  return (
    <div className="App">
      <h1>Smart Energy App</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => setView('scanner')}
          className={view === 'scanner' ? 'nav-btn active' : 'nav-btn'}
        >
          <Scan size={18} /> Scanner
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={view === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
      </div>

      {view === 'scanner' ? (
        <div className="container">
          {scanResult ? (
            <div className="success-text">
              <h3>Scan Successful!</h3>
              <p>Battery: {scanResult}</p>
              <p>Vendor: {vendorName || 'General'}</p>
              <button onClick={() => { setScanResult(null); setVendorName(''); }}>Scan Next</button>
            </div>
          ) : (
            <div className="scanner-box">
              {/* Vendor Name Input Field */}
              <input
                type="text"
                placeholder="Vendor ka naam likho..."
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="vendor-input"
              />
              <p style={{ color: '#94a3b8', marginBottom: '15px' }}>Scan Battery QR Code</p>
              <div id="reader"></div>
            </div>
          )}
        </div>
      ) : (
        <Dashboard data={allScans} />
      )}

      <footer className="footer">
        Smart Energy Management | Ghaziabad
      </footer>
    </div>
  );
}

export default App;