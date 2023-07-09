import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './reset.scss';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)