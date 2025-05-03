import 'antd/dist/reset.css'; // Importar estilos globales de Ant Design v5
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tus propios estilos globales
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();