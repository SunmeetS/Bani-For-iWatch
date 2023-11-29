import { useState } from 'react';
import './App.less'
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export const isMobile = window.innerWidth <= 425

export const API_URL = 'https://api.banidb.com/v2/';
export async function fetcher(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
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
    const dataFromLS = JSON.parse(JSON.parse(localStorage.getItem(key)))
    return dataFromLS;
  } catch (err) {
    return;
  }
}

function App() {
  const appRef = React.useRef()
  const [route, setRoute] = useState('')
  
  const navigate = useNavigate()

  return (
      <div ref={appRef} className="App">
        {route === '' && <div className="homeScreen">
          <>
            <h1 onClick={() => {
              setRoute('Find a Shabad');
              navigate('/find-a-shabad')
            }} className='tuk'>
              Search a Shabad
            </h1>
            <h1 onClick={() => {
              setRoute('Beant Baaniyan');
              navigate('/beant-baaniyan')
            }} className='tuk'>
              Read a Bani
            </h1>
            <h1 onClick={() => {
              setRoute('Darbar Sahib Live');
              navigate('/darbar-sahib-live')
            }} className='tuk'>
              Darbar Sahib Live Audio
            </h1>
          </>
        </div>}
      </div>
  )
}

export default App;

