import { createContext, useEffect, useState } from 'react';
import './App.less'
import Banis from './Banis';
import { Bani as BaniType, debounce, fetchBani, fetchBanis, throttle, utils } from './utils';
import { Button, ButtonGroup, Checkbox, CircularProgress, Input, Link, Switch, Typography } from '@mui/joy';
import * as React from 'react';
import Bani from './Bani';
import Index from './Index';
import Presenter from './Presenter';
import { toUnicode } from 'gurmukhi-utils'
import Shabads from './Shabads';
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

export const BaniContext = createContext({});

function App() {
  const appRef = React.useRef()

  const [banis, setBanis] = useState([]);
  const [expandCustomisations, setExpandCustomisations] = useState(false);
  const [shabadID, setShabadID] = useState()
  const [baniName, setBaniName] = useState('')
  const [mode, setMode] = useState('dark')
  const [statusText, setStatusText] = useState<any>();

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(34);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { fetchBani, fetchBanis } = utils()
  const [baniID, setBaniID] = useState()

  const showCustomisations = baniID || shabadID

  const [isEnglish, setIsEnglish] = useState(false)
  const [showPunjabiMeaning, setShowPunjabiMeaning] = useState(false);
  const [scrolling, setScrolling] = useState({ status: false, speed: 10 });
  const [search, setSearch] = useState('');
  const [installationPrompt, showInstallationPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event>();
  const [presenterMode, setPresenterMode] = useState(false);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    showInstallationPrompt(true);
    console.log(`'beforeinstallprompt' event was fired.`);
  });

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const gurmukhiText = toUnicode(inputText);
    setSearch(gurmukhiText);
  };
  const [larivaarAssist, setLarivaarAssist] = useState({ state: false, lineIndex: 0, expand: false })

  const customisations = [
    <div>
      <Input placeholder="Search..." value={search} onChange={(e) => {
        setSearch(e.target.value.split(' ').join(''));
        handleInputChange(e);
      }} />
    </div>,
    <div key='displayMode' className='customisation'>
      <Typography className='switch'>Dark</Typography>
      <Switch className='switch' checked={mode === 'light'} onClick={(e) => setMode(e.target.checked ? 'light' : 'dark')} />
      <Typography className='switch'>Light</Typography>
    </div>,
    <div key={'larivaar'} className='customisation'>
      <Checkbox checked={isLarivaar} className='checkbox' onChange={(e) => setIsLarivaar(e.target.checked)} label='Larivaar' />
      {isLarivaar && <Checkbox style={{ marginLeft: '1rem' }} checked={larivaarAssist.state} className='checkbox' onChange={(e) => setLarivaarAssist({ ...larivaarAssist, state: e.target.checked })} label=' Larivaar Assist' />}
    </div>,
    <div key={'fontSize'} className='customisation'>
      <ButtonGroup size='sm' aria-label="Font Size">
        <Button onClick={() => setFontSize(fontSize + 1)}>+</Button>
        <Button >{fontSize}</Button>
        <Button onClick={() => setFontSize(fontSize - 1)}>-</Button>
      </ButtonGroup>
    </div>,
    <div key={'isEnglish'} className='customisation'>
      <Checkbox checked={isEnglish} className='checkbox' onChange={(e) => setIsEnglish(e.target.checked)} label='English' />
    </div>,
    <div style={{ display: showCustomisations ? 'flex' : 'none' }} key={'enArth'} className='customisation'>
      <Checkbox checked={showEnglishMeaning} className='checkbox' onChange={(e) => setShowEnglishMeaning(e.target.checked)} label='English Meanings' />
    </div>,
    <div style={{ display: showCustomisations ? 'flex' : 'none' }} key={'punArth'} className='customisation'>
      <Checkbox checked={showPunjabiMeaning} className='checkbox' onChange={(e) => setShowPunjabiMeaning(e.target.checked)} label='ਗੁਰਮੁਖੀ ਅਰਥ' />
    </div>,
    <div style={{ display: showCustomisations ? 'flex' : 'none' }} key={'autoScroll'} className='customisation'>
      <Checkbox checked={scrolling.status} className='checkbox' onChange={(e) => setScrolling({ ...scrolling, status: e.target.checked })} label='Auto Scroll' />
    </div>,
    <div style={{ display: scrolling.status ? 'flex' : 'none' }} key={'scrollSpeed'} className='customisation'>
      <ButtonGroup size='sm' aria-label="Scroll Speed">
        <Button onClick={() => setScrolling({ ...scrolling, speed: scrolling.speed + 1 })}>+</Button>
        <Button >{scrolling.speed}</Button>
        <Button onClick={() => setScrolling({ ...scrolling, speed: scrolling.speed - 1 })}>-</Button>
      </ButtonGroup>
    </div>,
    <div style={{ display: showCustomisations ? 'flex' : 'none' }} key={'presenterMode'} className='customisation'>
      <Checkbox checked={presenterMode} className='checkbox' onChange={(e) => {
        setPresenterMode(() => {
          return e.target.checked
        }
        );
      }} label='Presenter Mode' />
    </div>,
    
  ]

  const root = document.querySelector(':root') as HTMLElement;

  if (mode === 'dark') {
    root.style.setProperty('--mainFontColor', 'rgba(255, 193, 87, 0.888)')
    root.style.setProperty('--mainBackgroundColor', 'rgb(0 10 36)')
    root.style.setProperty('--titleFontColor', 'rgb(0, 185, 247)');
    root.style.setProperty('--gurmukhiMeaningsFontColor', 'lightGreen')
    root.style.setProperty('--englishMeaningsFontColor', 'lightcyan');
    root.style.setProperty('--larivaarAssistFontColor', 'rgb(185 117 0)');
    root.style.setProperty('--headerBackgroundColor', 'rgba(255, 193, 87)');
    root.style.setProperty('--headerFontColor', 'black');
  }
  if (mode === 'light') {
    root.style.setProperty('--mainFontColor', '#1a00ba')
    root.style.setProperty('--mainBackgroundColor', '#e8e8e8')
    root.style.setProperty('--titleFontColor', 'rgb(175 0 192 / 81%)');
    root.style.setProperty('--gurmukhiMeaningsFontColor', '#8d2773d9')
    root.style.setProperty('--englishMeaningsFontColor', '#056700');
    root.style.setProperty('--larivaarAssistFontColor', '#0072ddd1');
    root.style.setProperty('--headerBackgroundColor', '#1a00ba');
    root.style.setProperty('--headerFontColor', 'white');
  }

  const [route, setRoute] = useState('')

  const [scrollPosition, setScrollPosition] = useState({ prev: 0, current: 0 });

  const setOpacity = () => {
    if(expandCustomisations) return 1;
    const { prev, current } = scrollPosition
    if (current < 20) return '1';
    if (scrolling.status || current < prev) return '0.9';
    if (current > prev) return '0';
  }

  useEffect(() => {
    const header = document.querySelector('.customisations') as HTMLElement;

    if (header) {
      header.style.opacity = setOpacity()
    }
  }, [scrollPosition])
  useEffect(() => {
    if (presenterMode) {
      document.documentElement?.requestFullscreen?.();
      setFontSize(40);
      setShowEnglishMeaning(true);
      setShowPunjabiMeaning(true);
    }
    else {
      document.exitFullscreen?.()
      setFontSize(34);
    }
  }, [presenterMode])

  const throttledScroll = throttle((e) => {
    setScrollPosition((val) => {
      return {
        prev: val.current,
        current: e.target.scrollTop
      }
    });
  }, 100)

  useEffect(() => {
    const savedBanis = getFromLS('banisList')
    if (!savedBanis) {
      fetchBanis().then(banis => {
        setBanis(banis)
        saveToLS('banisList', JSON.stringify(banis));

        setTimeout(() => {
          (banis as BaniType[]).slice(0, 30).map((bani) => {
            const { ID } = bani
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

    if(!localStorage.getItem('cleared')) {
      localStorage.clear();
      localStorage.setItem('cleared', 'true')
    }
  }, [])

  return (
    <BaniContext.Provider value={{
      banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize,
      setFontSize, baniID, setBaniID, isEnglish, setIsEnglish,
      showEnglishMeaning, setShowEnglishMeaning, loading, setLoading,
      error, setError, showPunjabiMeaning, search, setSearch, presenterMode, setPresenterMode,
      setOpacity, throttledScroll, scrollPosition, setScrollPosition, scrolling, setScrolling, expandCustomisations, setExpandCustomisations
      , larivaarAssist, setLarivaarAssist, shabadID, setShabadID, setRoute, baniName, setBaniName, statusText, setStatusText
    }}>
      <div ref={appRef} className="App">
        <div className={expandCustomisations ? "expandCustomisations" : 'customisations'}>
          <div className={expandCustomisations ? "buttonGroupNoMarginTop" : 'buttonGroup'} >
            <svg onClick={() => setExpandCustomisations(!expandCustomisations)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" style={{ width: '30px' }} viewBox="0 0 50 50">
              <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"></path>
            </svg>

            {(isMobile || !expandCustomisations) && <h1 style={{ fontWeight: 'bold' }}>{route}</h1>} 

            { expandCustomisations && <>
              {(route !== '') && <Button onClick={() => {
                setBaniID(null);
                setShabadID(null);
                setRoute('')
              }}>{'Go Back'}</Button>}
              <Button style={{ display: installationPrompt ? 'block' : 'none' }} onClick={() => { deferredPrompt?.prompt(); setDeferredPrompt(null); showInstallationPrompt(false) }}>
                Install This App
              </Button>
            </>}
          </div>
          {expandCustomisations && <>
            {
              customisations?.map((ele) => ele)
            }
          </>}
        </div>  
        {route === '' && <div className="homeScreen">
          <>
            <h1 onClick={() => setRoute('Find a Shabad')} className='tuk'>
              Search a Shabad
            </h1>
            <h1 onClick={() => setRoute('Beant Baaniyan')} className='tuk'>
              Read a Bani
            </h1>
          </>
        </div>}
        {route === 'Beant Baaniyan' && <Banis />}
        {route === 'Find a Shabad' && <Shabads />}
        {(route === baniName) && <Bani shabadId={shabadID} baniId={baniID} />}
      </div>
    </BaniContext.Provider>
  )
}

export default App;

