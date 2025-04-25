import React from 'react';

function PriorityMap() {
  return (
    <div className="priority-map">
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Skill Exchange Map</h3>
        <p>Map view of available skill exchanges in your area</p>
        <div style={{ 
          width: '100%', 
          height: '250px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '15px'
        }}>
          Map visualization would appear here
        </div>
      </div>
    </div>
  );
}

export default PriorityMap;
