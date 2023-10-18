import { createContext, useEffect, useState } from 'react';
import './App.css'
import Banis from './Banis';
import { fetchBani, fetchBanis } from './utils';
import { Button, ButtonGroup, Checkbox, Link, Switch, Typography } from '@mui/joy';
import * as React from 'react';
import Bani from './Bani';

export const API_URL = 'https://api.banidb.com/v2/'
export async function fetcher(url) {
  return await fetch(url).then(res => res.json());
}
export function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFromLS(key) {
  return JSON.parse(JSON.parse(localStorage.getItem(key)))
}

export const BaniContext = createContext({});

function App() {

  const [banis, setBanis] = useState([]);

  const [mode, setMode] = useState('dark')

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(20);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false)

  setTimeout(() => {
    for(let i = 1; i<21; i++) {
      const currentlyPresent = getFromLS('bani' + i)
      if(!currentlyPresent) 
        fetchBani(i).then(bani => saveToLS('bani' + i, JSON.stringify(bani)))
      }
  }, 3000);

  const customisations = [
    <div key='displayMode' className='customisation'>
      <Typography className='switch'>Dark</Typography>
      <Switch className='switch' onClick={(e) => setMode(e.target.checked ? 'light' : 'dark')} />
      <Typography className='switch'>Light</Typography>
    </div>,
    <div key={'larivaar'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setIsLarivaar(e.target.checked)} label='Larivaar' />
    </div>,
    <div key={'fontSize'} className='customisation'>
      <ButtonGroup size='sm' aria-label="Font Size">
        <Button onClick={() => setFontSize(fontSize + 1)}>+</Button>
        <Button >{fontSize}</Button>
        <Button onClick={() => setFontSize(fontSize - 1)}>-</Button>
      </ButtonGroup>
    </div>,
    <div key={'isEnglish'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setIsEnglish(e.target.checked)} label='English' />
    </div>,
    <div key={'arth'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setShowEnglishMeaning(e.target.checked)} label='English Meanings' />
  </div>,
  ]


  const root = document.querySelector(':root') as HTMLElement;

  if (mode === 'dark') {
    root.style.setProperty('--mainFontColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--mainBackgroundColor', 'rgb(17 17 17)')
    root.style.setProperty('--titleFontColor', 'rgb(0, 185, 247)');
    saveToLS('--mainFontColor', 'rgba(255, 193, 87, 0.888)')
    saveToLS('--mainBackgroundColor', 'rgb(17 17 17)')
    saveToLS('--titleFontColor', 'rgb(0, 185, 247)')
  }
  if (mode === 'light') {
    root.style.setProperty('--mainFontColor', 'rgb(17 17 17)')
    root.style.setProperty('--mainBackgroundColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--titleFontColor', 'rgba(255, 3, 3, 0.807)');
    saveToLS('--mainFontColor', 'rgb(17 17 17)');
    saveToLS('--mainBackgroundColor', 'rgba(255, 193, 87, 0.888)');
    saveToLS('--titleFontColor', 'rgba(255, 3, 3, 0.807)');
  }

  const [baniID, setBaniID] = useState()

  const [isEnglish, setIsEnglish] = useState(false)

  const [loadingData, setLoadingData] = useState(<div></div>);
  useEffect(() => {
    setLoadingData(
    <div className='App center'>
      <h2>Loading...</h2>
    </div>
    )

    fetchBanis().then(banis => {
      setBanis(banis)
      setLoadingData(null)
    }).catch(() => {
      setLoadingData (
    <div className='App center'>
      <p>
        We are unable to fetch right now. Please Try Again Later.
      </p>
      <br />
      <h2>।। ਧੰਨ ਗੁਰੂ ਨਾਨਕ ।।</h2>
      <br/>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
      )
    }
  )
  }, [])

  if (loadingData) {
    return loadingData;
  }

  return (
    <BaniContext.Provider value={{
      banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize,
      setFontSize, baniID, setBaniID, isEnglish, setIsEnglish, 
      showEnglishMeaning, setShowEnglishMeaning
    }}>
      <div className="App">
        <div className="customisations">
          {baniID && <Button onClick={() => setBaniID(null)}>{'<'}</Button>}
          {
            customisations.map((ele) => ele)
          }
        </div>
        {!baniID && <Banis />}
        {baniID && <Bani id={baniID} />}
      </div>
    </BaniContext.Provider>
  )
}

export default App;

