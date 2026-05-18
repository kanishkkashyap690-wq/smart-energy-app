import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([]);

  // Yahan Render ke API se data fetch hoga
  useEffect(() => {
    fetch('https://smart-energy-app-bbac.onrender.com/api/battery-history')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.log("Data error:", err));
  }, []);

  return (
    <div style={{ padding: '20px', color: '#2c3e50' }}>
      {/* --- CARDS SECTION --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}><h3>Today's Scans</h3><p>{data.length}</p></div>
        <div style={cardStyle}><h3>Out on Rent</h3><p>12 / 100</p></div>
        <div style={cardStyle}><h3>Revenue</h3><p>₹500</p></div>
      </div>

      {/* --- GRAPH SECTION --- */}
      <div style={{ height: '300px', background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h4>Rental Momentum</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" stroke="#3498db" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- TABLE SECTION --- */}
      <h4>Recent Deliveries</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#ecf0f1' }}>
          <tr>
            <th>Time</th>
            <th>Vendor</th>
            <th>Battery ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.time}</td>
              <td>{item.vendor}</td>
              <td>{item.qrData}</td>
              <td style={{ color: 'green' }}>Out</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cardStyle = { flex: 1, padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' };

export default Dashboard;