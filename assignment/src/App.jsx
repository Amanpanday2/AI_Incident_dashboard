
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import './App.css';

const severityLevels = ['Low', 'Medium', 'High'];

const App = () => {
  const [incidents, setIncidents] = useState(() => {
    const stored = localStorage.getItem('incidents');
    return stored ? JSON.parse(stored) : [];
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low'
  });
  const [filter, setFilter] = useState('All');
  const [sortKey, setSortKey] = useState('date');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  // useEffect(() => {
  //   document.body.style.backgroundColor = theme === 'dark' ? 'var(--bg-dark)' : 'var(--bg-light)';
  //   document.body.style.color = theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)';
    
  //   document.documentElement.style.setProperty(
  //     '--label-color',
  //     theme === 'dark' ? '#9ca3af' : '#4b5563' 
  //   );
  // }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = { ...formData, date: new Date().toISOString() };
    setIncidents(prev => [newIncident, ...prev]);
    setFormData({ title: '', description: '', severity: 'Low' });
  };

  const deleteIncident = (index) => {
    setIncidents(prev => prev.filter((_, i) => i !== index));
  };

  const filteredIncidents = incidents.filter(i =>
    filter === 'All' || i.severity === filter
  );

  const sortedIncidents = [...filteredIncidents].sort((a, b) =>
    sortKey === 'date'
      ? new Date(b.date) - new Date(a.date)
      : severityLevels.indexOf(b.severity) - severityLevels.indexOf(a.severity)
  );

  return (
    <div className="app-container">
      <motion.button
        className="theme-toggle-icon"
        onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        whileTap={{ rotate: 360 }}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <h1 className="title">AI Safety Incident Dashboard</h1>

      <form className="centered-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            name="title"
            className="input"
            placeholder=" "
            value={formData.title}
            onChange={handleChange}
            required
          />
          <label className="input-label">Incident Title</label>
        </div>

        <div className="input-container">
          <textarea
            name="description"
            className="input"
            placeholder=" "
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
          <label className="input-label">Description</label>
        </div>

        <div className="input-container">
          <select
            name="severity"
            className="input"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            {severityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <label className="input-label">Severity</label>
        </div>

        <button className="btn" type="submit">Log Incident</button>
      </form>

      <div className="filter-container">
        <div>
          <label>Filter by Severity:</label>
          <select onChange={e => setFilter(e.target.value)} value={filter} className="input">
            <option value="All">All</option>
            {severityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Sort by:</label>
          <select onChange={e => setSortKey(e.target.value)} value={sortKey} className="input">
            <option value="date">Date</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>
      {/* <div className="grid-make"> */}
      <div className="incident-grid">
        <AnimatePresence>
          {sortedIncidents.map((incident, idx) => (
            console.log(sortedIncidents),
        <div className='controls'>
            <motion.div
              className="card"
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <h3>{incident.title}</h3>
              <p>{incident.description}</p>
              <small>Severity: {incident.severity}</small>
              <small>Date: {new Date(incident.date).toLocaleString()}</small>
              <button className="delete-btn" onClick={() => deleteIncident(idx)}>Delete</button>
            </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
      </div>
    // </div>
  );
};

export default App;
