import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

const history = createBrowserHistory();
ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <App history={history} />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
serviceWorker.unregister();
