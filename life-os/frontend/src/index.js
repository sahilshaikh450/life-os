import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global font import via inline style
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070714; font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
  ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,0.5); }
  select option { background: #1a1a2e; color: #f1f5f9; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
