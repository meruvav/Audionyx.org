import React from 'react';

export default function Panel({ title, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
