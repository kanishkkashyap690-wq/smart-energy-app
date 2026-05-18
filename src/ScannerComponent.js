import React, { useState } from 'react';
import ScannerComponent from './ScannerComponent'; // Make sure ye file bani ho
import Dashboard from './Dashboard'; // Make sure ye file bani ho

function App() {
  // 'view' state decide karti hai ki Scanner dikhega ya Dashboard
  const [view, setView] = useState('scanner');

  return (
    <div className="App" style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f7f6',
      minHeight: '100vh'
    }}>
      {/* --- NAVIGATION MENU (Ye buttons hi design badlenge) --- */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
        background: '#2c3e50',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => setView('scanner')}
          style={{
            padding: '12px 24px',
            cursor: 'pointer',
            backgroundColor: view === 'scanner' ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          📤 Battery Out (Scan)
        </button>
        <button
          onClick={() => setView('dashboard')}
          style={{
            padding: '12px 24px',
            cursor: 'pointer',
            backgroundColor: view === 'dashboard' ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          📊 View Dashboard
        </button>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {view === 'scanner' ? (
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Battery Out System</h2>
            <ScannerComponent />
          </div>
        ) : (
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Business Dashboard</h2>
            <Dashboard />
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
        Smart Energy Business Management v2.0 | Ghaziabad
      </footer>
    </div>
  );
}

export default App;