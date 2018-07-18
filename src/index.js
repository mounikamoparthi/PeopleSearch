import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Search from './Search';

ReactDOM.render(<App />, document.getElementById('root'));

var destnation = document.querySelector('#container')

ReactDOM.render(
    <div>
        <Search/>
    </div>,destnation
)


registerServiceWorker();
