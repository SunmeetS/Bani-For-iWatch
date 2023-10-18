import { createContext, useEffect, useState } from 'react';
import './App.css'
import Banis from './Banis';
import { fetchBani, fetchBanis, utils } from './utils';
import { Button, ButtonGroup, Checkbox, Link, Switch, Typography } from '@mui/joy';
import * as React from 'react';
import Bani from './Bani';

export const API_URL = 'https://api.banidb.com/v2/'
export async function fetcher(url, setLoading, setError) {
  // setLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    // setLoading(false);
    // setError(false);
    return data;
  } catch (err) {
    // setLoading(false);
    // setError(true);
  }
}
export function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFromLS(key) {
  try {
    const dataFromLS = JSON.parse(JSON.parse(localStorage.getItem(key)))
    return dataFromLS;
  }catch(err) {
    return 'Refetch and Save to Localstorage';
  }
}

export const BaniContext = createContext({});

function App() {

  const [banis, setBanis] = useState([]);

  const [mode, setMode] = useState('dark')

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(20);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false)
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState(false);

  const { fetchBani, fetchBanis } = utils(setError, setLoading)
  const [baniID, setBaniID] = useState()

  const [isEnglish, setIsEnglish] = useState(false)
  const [showPunjabiMeaning, setShowPunjabiMeaning] = useState(false);

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
    <div key={'enArth'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setShowEnglishMeaning(e.target.checked)} label='English Meanings' />
    </div>,
    <div key={'punArth'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setShowPunjabiMeaning(e.target.checked)} label='ਗੁਰਮੁਖੀ ਅਰਥ' />
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


  const [loadingData, setLoadingData] = useState(<div></div>);
  useEffect(() => {
    fetchBanis().then(banis => {
      setBanis(banis)

      setTimeout(() => {
        for(let i = 1; i<=20; i++) {
          const currentlyPresent = getFromLS('bani' + i)
          if(!currentlyPresent) 
            fetchBani(i).then(bani => {
              if(bani) saveToLS('bani' + i, JSON.stringify(bani))})
          }
      }, 3000);
    })
  }, [])

  if (loading) {
    return loadingData;
  }

  return (
    <BaniContext.Provider value={{
      banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize,
      setFontSize, baniID, setBaniID, isEnglish, setIsEnglish, 
      showEnglishMeaning, setShowEnglishMeaning, loading, setLoading, 
      error, setError, showPunjabiMeaning
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

