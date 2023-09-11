import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import i18n from './i18n';

i18n.init({fallbackLng: "en", debug: true});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <App />
);
