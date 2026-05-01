import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState({ totalScans: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // RENDER LINK FOR FETCHING DATA
      const response = await fetch('https://smart-energy-app-bbac.onrender.com/api/scans');
      const data = await response.json();
      setScans(data);

      // Calculate Stats
      const revenue = data.length * 20; // 20 Rupees per battery
      setStats({ totalScans: data.length, totalRevenue: revenue });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Business Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>Today's Scans: {stats.totalScans}</h3>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>Total Revenue: ₹{stats.totalRevenue}</h3>
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Time</th>
            <th>Vendor / Vyapari</th>
            <th>Battery ID</th>
          </tr>
        </thead>
        <tbody>
          {scans.length > 0 ? scans.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.vendor}</td>
              <td>{item.qrData}</td>
            </tr>
          )) : (
            <tr><td colSpan="3">No scans found today.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;