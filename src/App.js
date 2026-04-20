import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import './App.css';

function App() {
  const [batteries, setBatteries] = useState([]);
  const [newSerial, setNewSerial] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // 1. Sabhi batteries fetch karne ke liye (Ngrok Link Updated)
  const fetchBatteries = async () => {
    try {
      const res = await fetch('https://equal-giveaway-chatroom.ngrok-free.dev/api/batteries/all');
      const data = await res.json();
      setBatteries(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, []);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      });

      scanner.render(async (decodedText) => {
        const battery = batteries.find(b => b.serialNumber === decodedText);

        if (battery) {
          // 2. Auto-Toggle Status (Ngrok Link Updated)
          let newStatus, vendor;
          if (battery.status === 'Available') {
            vendor = prompt(`Battery ${decodedText} ke liye Vendor ka naam?`);
            if (!vendor) {
               setIsScanning(false);
               scanner.clear();
               return;
            }
            newStatus = 'Rented';
          } else {
            newStatus = 'Available';
            vendor = 'None';
            alert(`Battery ${decodedText} wapas mil gayi!`);
          }

          await fetch(`https://equal-giveaway-chatroom.ngrok-free.dev/api/batteries/update/${battery._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, vendorName: vendor })
          });
          fetchBatteries();
        } else {
          setNewSerial(decodedText);
          alert("Nayi battery mili hai. Register karne ke liye niche Add dabayein.");
        }

        setIsScanning(false);
        scanner.clear();
      });

      return () => scanner.clear();
    }
  }, [isScanning, batteries]);

  // 3. Nayi battery add karne ke liye (Ngrok Link Updated)
  const addBattery = async () => {
    if (!newSerial) return;
    await fetch('https://equal-giveaway-chatroom.ngrok-free.dev/api/batteries/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serialNumber: newSerial })
    });
    setNewSerial('');
    fetchBatteries();
  };

  // 4. Battery delete karne ke liye (Ngrok Link Updated)
  const deleteBattery = async (id) => {
    if (window.confirm("Ise delete karein?")) {
      await fetch(`https://equal-giveaway-chatroom.ngrok-free.dev/api/batteries/${id}`, { method: 'DELETE' });
      fetchBatteries();
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#333' }}>Smart Energy Battery Manager</h1>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsScanning(!isScanning)}
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {isScanning ? "❌ Stop Scanner" : "📸 Scan Battery (Rent/Return)"}
        </button>

        {isScanning && <div id="reader" style={{ marginTop: '20px' }}></div>}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <input
          value={newSerial}
          onChange={(e) => setNewSerial(e.target.value)}
          placeholder="Manual Entry / Scanned Serial"
          style={{ padding: '10px', width: '250px' }}
        />
        <button onClick={addBattery} style={{ padding: '10px 20px', marginLeft: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Add New Battery
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#343a40', color: 'white' }}>
          <tr>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Current Vendor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {batteries.length > 0 ? (
            batteries.map(b => (
              <tr key={b._id}>
                <td><strong>{b.serialNumber}</strong></td>
                <td>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: b.status === 'Rented' ? '#ffc107' : '#d4edda',
                    fontWeight: 'bold'
                  }}>
                    {b.status}
                  </span>
                </td>
                <td>{b.vendorName || 'None'}</td>
                <td>
                  <button onClick={() => deleteBattery(b._id)} style={{ color: 'red', border: '1px solid red', padding: '5px', cursor: 'pointer', borderRadius: '3px' }}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No batteries found. Scan one to add!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;