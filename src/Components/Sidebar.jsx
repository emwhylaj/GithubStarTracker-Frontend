import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="back-button">
          <span></span>Settings
        </NavLink>
      </div>
      
      <div className="sidebar-section">
        <h3>Account</h3>
        <ul>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/" className="active">Repositories</NavLink></li>
          <li><NavLink to="/storage">Storage accounts</NavLink></li>
          <li><NavLink to="/notifications">Notifications</NavLink></li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>Data</h3>
        <ul>
          <li><NavLink to="/objects">Objects</NavLink></li>
          <li><NavLink to="/lists">Lists</NavLink></li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>Reports</h3>
        <ul>
          <li><NavLink to="/dashboards">Dashboards</NavLink></li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>Automations</h3>
        <ul>
          <li><NavLink to="/workflows">Workflows</NavLink></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;