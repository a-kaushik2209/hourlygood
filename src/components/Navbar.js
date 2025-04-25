import React from 'react';

function Navbar({ setPage }) {
  return (
    <nav style={{ background: '#2196f3', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setPage('landing')}>
        Saarthi
      </div>
      <div>
        <button onClick={() => setPage('report')} style={{ margin: '0 5px' }}>Report</button>
        <button onClick={() => setPage('map')} style={{ margin: '0 5px' }}>Alerts</button>
        <button onClick={() => setPage('volunteer')} style={{ margin: '0 5px' }}>Volunteer</button>
        <button onClick={() => setPage('dashboard')} style={{ margin: '0 5px' }}>Dashboard</button>
      </div>
    </nav>
  );
}

export default Navbar;
