import { createContext, useEffect, useState } from 'react';
import './App.css'
import Banis from './Banis';
import Bani from './Bani'
import { fetchBanis } from './utils';
import { Button, ButtonGroup, Checkbox, Switch, Typography } from '@mui/joy';
import { useContext } from 'react';

export const API_URL = 'https://api.banidb.com/v2/'
export async function fetcher(url) {
  return await fetch(url).then(res => res.json());
}
export function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const BaniContext = createContext();

function App() {

  const [banis, setBanis] = useState([]);

  const [mode, setMode] = useState('dark')

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(20);

  const customisations = [
    <div key='displayMode' className='customisation'>
      <Typography>Dark</Typography>
      <Switch onClick={(e) => setMode(e.target.checked ? 'light' : 'dark')} />
      <Typography>Light</Typography>
    </div>,
    <div key={'larivaar'} className='customisation'>
      <Checkbox onChange={(e) => setIsLarivaar.checked} label='Larivaar' />
    </div>,
    <div key={'fontSize'} className='customisation'>
      <ButtonGroup size='sm' aria-label="Font Size">
        <Button onClick={() => setFontSize(fontSize + 1)}>+</Button>
        <Button >{fontSize}</Button>
        <Button onClick={() => setFontSize(fontSize - 1)}>-</Button>
      </ButtonGroup>
    </div>,
  ]


  const root = document.querySelector(':root');

  if(mode === 'dark') {
    root.style.setProperty('--mainFontColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--mainBackgroundColor', 'rgb(17 17 17)')
    root.style.setProperty('--titleFontColor', 'rgb(0, 185, 247)');
    saveToLS('--mainFontColor', 'rgba(255, 193, 87, 0.888)') 
    saveToLS('--mainBackgroundColor', 'rgb(17 17 17)')
    saveToLS('--titleFontColor', 'rgb(0, 185, 247)')
  }
  if(mode === 'light') {
    root.style.setProperty('--mainFontColor', 'rgb(17 17 17)')
    root.style.setProperty('--mainBackgroundColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--titleFontColor', 'rgba(255, 3, 3, 0.807)');
    saveToLS('--mainFontColor', 'rgb(17 17 17)');
    saveToLS('--mainBackgroundColor', 'rgba(255, 193, 87, 0.888)');
    saveToLS('--titleFontColor', 'rgba(255, 3, 3, 0.807)');
  }

  useEffect(() => {  
    fetchBanis().then(banis => setBanis(banis))
  }, [])  

  return(
    <BaniContext.Provider value={{banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize, setFontSize}}>
      <div className="App">
        <Banis/>
        {/* <div style={{display:'none'}}>
          <Bani/>
        </div> */}
      </div>
    </BaniContext.Provider>
  )
}

export default App;

