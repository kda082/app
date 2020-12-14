import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';

import {Provider} from 'react-redux';  // redux provider
import { applyMiddleware, createStore } from 'redux';

import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

// 일반 store는 object밖에 못받기때문에 middleware를 사용해서  promise와 function을 받을수있게 맞춤형 store생성
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware,ReduxThunk)(createStore)  



ReactDOM.render(
  <Provider
      store={createStoreWithMiddleware(Reducer,
       window.__REDUX_DEVTOOLS_EXTENSION__ && 
       window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
  > 
      <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
