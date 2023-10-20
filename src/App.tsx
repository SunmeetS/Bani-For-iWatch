import { createContext, useEffect, useState } from 'react';
import './App.css'
import Banis from './Banis';
import { debounce, fetchBani, fetchBanis, throttle, utils } from './utils';
import { Button, ButtonGroup, Checkbox, CircularProgress, Input, Link, Switch, Typography } from '@mui/joy';
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
    console.log(err)
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
  } catch (err) {
    return 'Refetch and Save to Localstorage';
  }
}

export const BaniContext = createContext({});

function App() {
  const appRef = React.useRef(null)

  const [banis, setBanis] = useState([]);

  const [mode, setMode] = useState('light')

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(24);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { fetchBani, fetchBanis } = utils(setError, setLoading)
  const [baniID, setBaniID] = useState()

  const [isEnglish, setIsEnglish] = useState(false)
  const [showPunjabiMeaning, setShowPunjabiMeaning] = useState(false);
  const [scrolling, setScrolling] = useState({status: false, speed: 100});
  const [search, setSearch] = useState('');

  useEffect(() => {
    let interval;
  
    if (scrolling.status) {
      if (!interval) {
        interval = setInterval(() => {
          appRef?.current.scrollBy({
            top: scrolling.speed,
            behavior: 'smooth'
          });      
        }, 50);
      }
    } else {
      if (interval) {
        clearInterval(interval);
        interval = null; 
      }
    }
      return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [scrolling.status, scrolling.speed]);

  const customisations = [
    <div style={{display: !baniID ? 'flex' : 'none'}}>
      <Input placeholder="Search..." onChange={(e) => debounce(setSearch(e.target.value.split(' ').join('')), 1000)}/>
    </div>,
    <div key='displayMode' className='customisation'>
      <Typography className='switch'>Dark</Typography>
      <Switch className='switch' checked={mode === 'light'} onClick={(e) => setMode(e.target.checked ? 'light' : 'dark')} />
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
    <div style={{display: baniID ? 'flex' : 'none'}} key={'enArth'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setShowEnglishMeaning(e.target.checked)} label='English Meanings' />
    </div>,
    <div style={{display: baniID ? 'flex' : 'none'}} key={'punArth'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setShowPunjabiMeaning(e.target.checked)} label='ਗੁਰਮੁਖੀ ਅਰਥ' />
    </div>,
    <div style={{display: baniID ? 'flex' : 'none'}} key={'autoScroll'} className='customisation'>
      <Checkbox className='checkbox' onChange={(e) => setScrolling({...scrolling, status: e.target.checked})} label='Auto Scroll' />
    </div>,
    <div style={{display: scrolling.status ? 'flex' : 'none'}} key={'scrollSpeed'} className='customisation'>
      <ButtonGroup size='sm' aria-label="Scroll Speed">
        <Button onClick={() => setScrolling({...scrolling, speed: scrolling.speed + 1})}>+</Button>
        <Button >{scrolling.speed}</Button>
        <Button onClick={() => setScrolling({...scrolling, speed: scrolling.speed - 1})}>-</Button>
      </ButtonGroup>
    </div>,
  ]


  const root = document.querySelector(':root') as HTMLElement;

  if (mode === 'dark') {
    root.style.setProperty('--mainFontColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--mainBackgroundColor', 'rgb(0 10 36)')
    root.style.setProperty('--titleFontColor', 'rgb(0, 185, 247)');
    root.style.setProperty('--gurmukhiMeaningsFontColor', 'lightGreen')
    root.style.setProperty('--englishMeaningsFontColor', 'lightcyan');
    root.style.setProperty('--fontWeight', '400')
  }
  if (mode === 'light') {
    root.style.setProperty('--mainFontColor', '#1a00ba')
    root.style.setProperty('--mainBackgroundColor', '#d5d5b1')
    root.style.setProperty('--titleFontColor', 'rgba(255, 3, 3, 0.807)');
    root.style.setProperty('--gurmukhiMeaningsFontColor', '#8d2773d9')
    root.style.setProperty('--englishMeaningsFontColor', '#056700');
    root.style.setProperty('--fontWeight', '600')
  }
  root.style.setProperty('--headerBackgroundColor', 'rgb(195 87 255)');


  const [loadingData, setLoadingData] = useState(<div></div>);

  const [scrollPosition, setScrollPosition] = useState({ prev: 0, current: 0 });

  const setOpacity = () => {
    const { prev, current } = scrollPosition
    if (current < 20) return '1';
    if (scrolling.status || current < prev) return '0.9';
    if (current > prev) return '0';
  }

  useEffect(() => {
    const header = document.querySelector('.customisations') as HTMLElement;

    header.style.opacity = setOpacity()
  }, [scrollPosition])

  useEffect(() => {
    const savedBanis = getFromLS('banisList')
    if(!savedBanis) {
      fetchBanis().then(banis => {
        setBanis(banis)
        saveToLS('banisList', JSON.stringify(banis));

        setTimeout(() => {
          (banis).map((bani) => {
            const {ID} = bani
            const currentlyPresent = getFromLS('bani' + ID);
            if (!currentlyPresent)
              fetchBani(ID).then(bani => {
                if (bani) saveToLS('bani' + ID, JSON.stringify(bani))
              })
            })
          }, 3000);
        })
      } else {
        setBanis((savedBanis))
      }
      const throttledScroll = throttle((e) => {
        setScrollPosition((val) => {
          return {
            prev: val.current,
            current: e.target.scrollTop
          }
        });
      }, 100)

      appRef.current.focus();
      appRef?.current.addEventListener('scroll', throttledScroll)

  }, [])

  if (loading) {
    return <CircularProgress color='success'/>;
  }

  return (
    <BaniContext.Provider value={{
      banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize,
      setFontSize, baniID, setBaniID, isEnglish, setIsEnglish,
      showEnglishMeaning, setShowEnglishMeaning, loading, setLoading,
      error, setError, showPunjabiMeaning, search, setSearch
    }}>
      <div ref={appRef} className="App">
        <div className="customisations">
          {baniID && <Button onClick={() => setBaniID(null)}>{'<'}</Button>}
          {
            customisations?.map((ele) => ele)
          }
        </div>
        {!baniID && <Banis />}
        {baniID && <Bani id={baniID} />}
      </div>
    </BaniContext.Provider>
  )
}

export default App;

