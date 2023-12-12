import { useState } from 'react';
import './App.less'
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { baniCache } from './utils';

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
          <>
            <h1 onClick={() => {
              navigate('/find-a-shabad')
            }} className='tuk navigation'>
              Search a Shabad
            </h1>
            <h1 onClick={() => {
              navigate('/beant-baaniyan')
            }} className='tuk navigation'>
              Read a Bani
            </h1>
            <h1 onClick={() => {
              navigate('/live-audio')
            }} className='tuk navigation'>
              Live Kirtan From Itihaasik Gurudwaras
            </h1>
          </>
        </div>
      </div>
  )
}

export default App;

