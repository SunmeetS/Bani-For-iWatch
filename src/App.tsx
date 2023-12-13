import { useState } from 'react';
import './App.less'
import * as React from 'react';
import { baniCache } from './utils';
import Todo from './Todo';
import { useNavigate } from 'react-router-dom';

export const isMobile = window.innerWidth <= 425

export const API_URL = 'https://api.banidb.com/v2/';
export async function fetcher(url) {
  try {
    if(baniCache[url]) {
      return baniCache[url];
    }
    const response = await fetch(url);
    const data = await response.json();
    baniCache[url] = data;
    return baniCache[url];
  } catch (err) {
    console.log(err)
  }
}
export function saveToLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.log(err)
  }
}

export function getFromLS(key) {
  try {
    const dataFromLS = JSON.parse(localStorage.getItem(key))
    return dataFromLS;
  } catch (err) {
    return;
  }
}

function App() {
  const appRef = React.useRef()
  const navigate = useNavigate()
  return (
      <div ref={appRef} className="App">
        <div className="homeScreen">
          <Todo navigate={navigate}/>
        </div>
      </div>
  )
}

export default App;

