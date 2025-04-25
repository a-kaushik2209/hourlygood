import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import PriorityMap from './PriorityMap';

function Dashboard({ setPage }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState([
    { id: 1, title: 'Active Incidents', value: 28, change: '+12%', positive: false },
    { id: 2, title: 'Volunteers Active', value: 156, change: '+24%', positive: true },
    { id: 3, title: 'Resources Deployed', value: 43, change: '+8%', positive: true },
    { id: 4, title: 'People Assisted', value: 1243, change: '+32%', positive: true }
  ]);

  const [incidents, setIncidents] = useState([
    { id: 1, type: 'Flooding', location: 'Yamuna Bank, East Delhi', priority: 'high', status: 'Active', reported: '2025-04-19 14:30' },
    { id: 2, type: 'Medical Emergency', location: 'Rohini Sector 8', priority: 'high', status: 'Active', reported: '2025-04-19 16:45' },
    { id: 3, type: 'Fire', location: 'Saket, South Delhi', priority: 'mid', status: 'Contained', reported: '2025-04-19 12:15' },
    { id: 4, type: 'Building Collapse', location: 'Old Delhi', priority: 'high', status: 'Active', reported: '2025-04-19 10:20' },
    { id: 5, type: 'Power Outage', location: 'Dwarka Sector 12', priority: 'low', status: 'Resolved', reported: '2025-04-18 22:10' },
    { id: 6, type: 'Water Shortage', location: 'Vasant Kunj', priority: 'mid', status: 'Active', reported: '2025-04-19 08:30' }
  ]);

  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all'
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filters.priority !== 'all' && incident.priority !== filters.priority) return false;
    if (filters.status !== 'all' && incident.status !== filters.status) return false;
    return true;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const randomStatIndex = Math.floor(Math.random() * stats.length);
      const updatedStats = [...stats];
      const randomChange = Math.floor(Math.random() * 5) - 2;
      
      updatedStats[randomStatIndex] = {
        ...updatedStats[randomStatIndex],
        value: Math.max(0, updatedStats[randomStatIndex].value + randomChange)
      };
      
      setStats(updatedStats);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Emergency Response Dashboard</h1>
          <p className="dashboard-subtitle">Real-time monitoring and coordination</p>
        </div>
        <div>
          <button style={{ background: 'var(--primary)', border: 'none', padding: '8px 15px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          Incidents
        </button>
        <button 
          className={`tab-button ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Map View
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <h3 className="section-title">Key Statistics <span className="scroll-hint">(scroll →)</span></h3>
          <div className="stats-grid">
            {stats.map(stat => (
              <div key={stat.id} className="stat-card">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Incidents <span className="scroll-hint">(scroll →)</span></h2>
            </div>
            <div className="card-body">
              <div style={{ overflowX: 'auto' }}>
                <table className="incidents-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.slice(0, 5).map(incident => (
                    <tr key={incident.id}>
                      <td>{incident.type}</td>
                      <td>{incident.location}</td>
                      <td>
                        <span className={`priority-dot priority-${incident.priority}`}></span>
                        {incident.priority === 'high' ? 'High' : incident.priority === 'mid' ? 'Medium' : 'Low'}
                      </td>
                      <td>{incident.status}</td>
                      <td>{incident.reported}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Resource Allocation <span className="scroll-hint">(scroll →)</span></h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <div className="chart-content scrollable-container" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                  {}
                  <div style={{ textAlign: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                    <div style={{ height: '150px', width: '20px', background: 'linear-gradient(to top, #2196f3, #64b5f6)', borderRadius: '10px', display: 'inline-block', marginBottom: '10px' }}></div>
                    <div>Medical</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                    <div style={{ height: '100px', width: '20px', background: 'linear-gradient(to top, #ff9800, #ffb74d)', borderRadius: '10px', display: 'inline-block', marginBottom: '10px' }}></div>
                    <div>Food</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                    <div style={{ height: '180px', width: '20px', background: 'linear-gradient(to top, #4caf50, #81c784)', borderRadius: '10px', display: 'inline-block', marginBottom: '10px' }}></div>
                    <div>Shelter</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                    <div style={{ height: '80px', width: '20px', background: 'linear-gradient(to top, #e91e63, #f48fb1)', borderRadius: '10px', display: 'inline-block', marginBottom: '10px' }}></div>
                    <div>Transport</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                    <div style={{ height: '120px', width: '20px', background: 'linear-gradient(to top, #9c27b0, #ce93d8)', borderRadius: '10px', display: 'inline-block', marginBottom: '10px' }}></div>
                    <div>Rescue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Incident Management</h2>
            </div>
            <div className="card-body">
              <div className="map-filters scrollable-container">
                <div className="filter-group scrollable-item">
                  <h3 className="filter-title">Priority Filter</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${filters.priority === 'all' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'high' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'high')}
                    >
                      High
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'mid' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'mid')}
                    >
                      Medium
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'low' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'low')}
                    >
                      Low
                    </button>
                  </div>
                </div>
                
                <div className="filter-group">
                  <h3 className="filter-title">Status Filter</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${filters.status === 'all' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Active' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Active')}
                    >
                      Active
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Contained' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Contained')}
                    >
                      Contained
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Resolved' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="incidents-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reported</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map(incident => (
                    <tr key={incident.id}>
                      <td>{incident.type}</td>
                      <td>{incident.location}</td>
                      <td>
                        <span className={`priority-dot priority-${incident.priority}`}></span>
                        {incident.priority === 'high' ? 'High' : incident.priority === 'mid' ? 'Medium' : 'Low'}
                      </td>
                      <td>{incident.status}</td>
                      <td>{incident.reported}</td>
                      <td>
                        <button style={{ background: '#333', border: 'none', padding: '5px 10px', borderRadius: '4px', color: 'white', marginRight: '5px', cursor: 'pointer' }}>
                          Details
                        </button>
                        <button style={{ background: 'var(--primary)', border: 'none', padding: '5px 10px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {activeTab === 'map' && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Emergency Map View</h2>
            </div>
            <div className="card-body" style={{ padding: '15px' }}>
              {}
              <PriorityMap />
              
              <div className="map-filters" style={{ marginTop: '30px' }}>
                <div className="filter-group">
                  <h3 className="filter-title">Priority Level</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${filters.priority === 'all' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'high' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'high')}
                    >
                      High
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'mid' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'mid')}
                    >
                      Medium
                    </button>
                    <button 
                      className={`filter-button ${filters.priority === 'low' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('priority', 'low')}
                    >
                      Low
                    </button>
                  </div>
                </div>
                
                <div className="filter-group">
                  <h3 className="filter-title">Status</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${filters.status === 'all' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Active' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Active')}
                    >
                      Active
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Contained' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Contained')}
                    >
                      Contained
                    </button>
                    <button 
                      className={`filter-button ${filters.status === 'Resolved' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('status', 'Resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Nearby Resources</h2>
            </div>
            <div className="card-body">
              <div style={{ overflowX: 'auto' }}>
                <table className="incidents-table">
                <thead>
                  <tr>
                    <th>Resource Type</th>
                    <th>Location</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Medical Team</td>
                    <td>AIIMS Hospital</td>
                    <td>2.3 km</td>
                    <td>Available</td>
                    <td>
                      <button style={{ background: 'var(--primary)', border: 'none', padding: '5px 10px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                        Deploy
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Fire Brigade</td>
                    <td>Central Fire Station</td>
                    <td>4.1 km</td>
                    <td>Available</td>
                    <td>
                      <button style={{ background: 'var(--primary)', border: 'none', padding: '5px 10px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                        Deploy
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Rescue Team</td>
                    <td>Civil Defense HQ</td>
                    <td>3.7 km</td>
                    <td>Busy</td>
                    <td>
                      <button style={{ background: '#555', border: 'none', padding: '5px 10px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>
                        Request
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {activeTab === 'analytics' && (
        <div className="fade-in">
          <h3 className="section-title">Performance Metrics <span className="scroll-hint">(scroll →)</span></h3>
          <div className="analytics-grid">
            <div className="chart-container">
              <h3 className="chart-title">Incidents by Type</h3>
              <div className="chart-content scrollable-container" style={{ display: 'flex', alignItems: 'flex-end', height: '220px' }}>
                {}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                  <div className="animated-bar" style={{ width: '50px', height: '180px', background: 'linear-gradient(to top, #2196f3, #64b5f6)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '14px' }}>42</div>
                  </div>
                  <div style={{ marginTop: '10px', color: '#ddd', fontSize: '13px', fontWeight: '500' }}>Flooding</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                  <div className="animated-bar" style={{ width: '50px', height: '120px', background: 'linear-gradient(to top, #ff9800, #ffb74d)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '14px' }}>28</div>
                  </div>
                  <div style={{ marginTop: '10px', color: '#ddd', fontSize: '13px', fontWeight: '500' }}>Fire</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                  <div className="animated-bar" style={{ width: '50px', height: '90px', background: 'linear-gradient(to top, #4caf50, #81c784)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '14px' }}>21</div>
                  </div>
                  <div style={{ marginTop: '10px', color: '#ddd', fontSize: '13px', fontWeight: '500' }}>Medical</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                  <div className="animated-bar" style={{ width: '50px', height: '60px', background: 'linear-gradient(to top, #e91e63, #f06292)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(233, 30, 99, 0.5)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '14px' }}>14</div>
                  </div>
                  <div style={{ marginTop: '10px', color: '#ddd', fontSize: '13px', fontWeight: '500' }}>Building</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', margin: '0 10px' }} className="scrollable-item">
                  <div className="animated-bar" style={{ width: '50px', height: '40px', background: 'linear-gradient(to top, #9c27b0, #ba68c8)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(156, 39, 176, 0.5)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '14px' }}>9</div>
                  </div>
                  <div style={{ marginTop: '10px', color: '#ddd', fontSize: '13px', fontWeight: '500' }}>Power</div>
                </div>
              </div>
            </div>
            
            <div className="chart-container">
              <h3 className="chart-title">Response Time Trend</h3>
              <div className="chart-content scrollable-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {}
                <svg width="100%" height="180" viewBox="0 0 300 180">
                  {}
                  <line x1="0" y1="40" x2="300" y2="40" style={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '3,3' }} />
                  <line x1="0" y1="80" x2="300" y2="80" style={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '3,3' }} />
                  <line x1="0" y1="120" x2="300" y2="120" style={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '3,3' }} />
                  
                  {}
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2196f3" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#2196f3" stopOpacity="0.1" />
                  </linearGradient>
                  <path
                    d="M0,100 50,80 100,90 150,60 200,40 250,50 300,30 L300,170 L0,170 Z"
                    fill="url(#areaGradient)"
                    className="chart-area"
                  />
                  
                  {}
                  <polyline
                    points="0,100 50,80 100,90 150,60 200,40 250,50 300,30"
                    style={{ fill: 'none', stroke: '#2196f3', strokeWidth: 3 }}
                    className="chart-line"
                  />
                  
                  {}
                  <circle cx="0" cy="100" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="50" cy="80" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="100" cy="90" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="150" cy="60" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="200" cy="40" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="250" cy="50" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  <circle cx="300" cy="30" r="4" fill="#fff" stroke="#2196f3" strokeWidth="2" />
                  
                  <line x1="0" y1="170" x2="300" y2="170" style={{ stroke: '#333', strokeWidth: 1 }} />
                  <text x="0" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 14</text>
                  <text x="50" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 15</text>
                  <text x="100" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 16</text>
                  <text x="150" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 17</text>
                  <text x="200" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 18</text>
                  <text x="250" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 19</text>
                  <text x="300" y="165" style={{ fill: '#aaa', fontSize: '10px' }}>Apr 20</text>
                  
                  {}
                  <text x="5" y="40" style={{ fill: '#aaa', fontSize: '10px' }}>15m</text>
                  <text x="5" y="80" style={{ fill: '#aaa', fontSize: '10px' }}>30m</text>
                  <text x="5" y="120" style={{ fill: '#aaa', fontSize: '10px' }}>45m</text>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Resource Utilization <span className="scroll-hint">(scroll →)</span></h2>
            </div>
            <div className="card-body">
              <div className="scrollable-container" style={{ marginBottom: '30px' }}>
                {}
                <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                  <svg width="120" height="120" viewBox="0 0 100 100" className="progress-circle">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2196f3" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" className="progress-circle-value" />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">75%</text>
                    <text x="50" y="65" textAnchor="middle" fill="#aaa" fontSize="12">Utilized</text>
                  </svg>
                  <div style={{ marginTop: '15px', color: '#fff', fontSize: '14px', fontWeight: '500' }}>Medical</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                  <svg width="120" height="120" viewBox="0 0 100 100" className="progress-circle">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ff9800" strokeWidth="8" strokeDasharray="283" strokeDashoffset="113" className="progress-circle-value" />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">60%</text>
                    <text x="50" y="65" textAnchor="middle" fill="#aaa" fontSize="12">Utilized</text>
                  </svg>
                  <div style={{ marginTop: '15px', color: '#fff', fontSize: '14px', fontWeight: '500' }}>Transport</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                  <svg width="120" height="120" viewBox="0 0 100 100" className="progress-circle">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#4caf50" strokeWidth="8" strokeDasharray="283" strokeDashoffset="142" className="progress-circle-value" />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">50%</text>
                    <text x="50" y="65" textAnchor="middle" fill="#aaa" fontSize="12">Utilized</text>
                  </svg>
                  <div style={{ marginTop: '15px', color: '#fff', fontSize: '14px', fontWeight: '500' }}>Food</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '150px' }} className="scrollable-item">
                  <svg width="120" height="120" viewBox="0 0 100 100" className="progress-circle">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e91e63" strokeWidth="8" strokeDasharray="283" strokeDashoffset="42" className="progress-circle-value" />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">85%</text>
                    <text x="50" y="65" textAnchor="middle" fill="#aaa" fontSize="12">Utilized</text>
                  </svg>
                  <div style={{ marginTop: '15px', color: '#fff', fontSize: '14px', fontWeight: '500' }}>Shelter</div>
                </div>
              </div>
              
              <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--primary)', marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Resource Allocation Recommendations</h3>
                <ul style={{ color: '#ddd', paddingLeft: '20px' }}>
                  <li>Increase medical teams in East Delhi region by 20%</li>
                  <li>Reallocate transport resources from South to North zone</li>
                  <li>Request additional shelter facilities from partner NGOs</li>
                  <li>Optimize food distribution routes to reduce response time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
