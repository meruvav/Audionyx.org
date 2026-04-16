import React from 'react';

export default function Sidebar({ sections, active, onSelect }) {
  return (
    <aside className="sidebar">
      {sections.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${active === item.id ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
          {item.badge ? <span className="badge">{item.badge}</span> : null}
        </button>
      ))}
    </aside>
  );
}
