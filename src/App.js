import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(result) {
      scanner.clear();
      setScanResult(result);
      saveScanData(result);
    }

    function onScanError(err) {
      // Console clean rakhne ke liye error hide kiya hai
    }

    return () => scanner.clear();
  }, []);

  const saveScanData = async (qrData) => {
    setLoading(true);
    try {
      // LOCALHOST HATA KAR RENDER KA LINK DAAL DIYA HAI
      const response = await fetch('https://smart-energy-app-bbac.onrender.com/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrData: qrData,
          vendor: vendorName || 'Unknown Vendor', // Agar naam nahi likha toh Unknown jayega
        }),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Server error: Data not saved.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server.");
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>SMART ENERGY APP</h1>

      {!scanResult ? (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Vendor / Vyapari ka naam"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <div id="reader"></div>
        </div>
      ) : (
        <div>
          <h3>Scan Successful!</h3>
          <p>Battery: {scanResult}</p>
          <p>Vendor: {vendorName || 'General'}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px' }}>
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;