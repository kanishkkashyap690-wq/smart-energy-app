import React from 'react';
import { Battery, Activity, DollarSign, List, TrendingUp, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const Dashboard = ({ data = [] }) => {

  // Real-time Chart Data: Har ghante kitni scan hui
  const getChartData = () => {
    const counts = {};
    data.slice(0, 10).forEach(item => {
      const hour = item.time.split(':')[0] + (item.time.includes('PM') ? ' PM' : ' AM');
      counts[hour] = (counts[hour] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ time: key, scans: counts[key] })).reverse();
  };

  const chartData = getChartData();

  return (
    <div className="dashboard-container">
      {/* Metrics Cards - Real Calculations */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="icon-box blue"><Activity size={24} /></div>
          <div><p>Today's Scans</p><h3>{data.length}</h3></div>
        </div>
        <div className="metric-card">
          <div className="icon-box green"><Battery size={24} /></div>
          <div><p>Out on Rent</p><h3>{data.length} / 100</h3></div>
        </div>
        <div className="metric-card">
          <div className="icon-box yellow"><DollarSign size={24} /></div>
          <div><p>Collection Today</p><h3>₹{data.length * 20}</h3></div> {/* ₹20 per battery charge */}
        </div>
      </div>

      {/* Live Chart from Real Data */}
      <div className="table-container" style={{ marginBottom: '30px', height: '300px' }}>
        <h3><TrendingUp size={20} /> Rental Momentum</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.length > 0 ? chartData : [{time: 'No Data', scans: 0}]}>
            <defs>
              <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="scans" stroke="#00d2ff" fillOpacity={1} fill="url(#colorScans)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity with Vendor Name */}
      <div className="table-container">
        <h3><List size={20} /> Recent Deliveries</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Vendor / Vyapari</th>
              <th>Battery ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td style={{ color: '#00d2ff' }}><User size={14} inline /> {item.vendor}</td>
                  <td>{item.qrData}</td>
                  <td><span className="status-tag">Out</span></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;