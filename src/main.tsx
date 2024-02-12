import { useState, createContext, useEffect } from "react";
import * as React from 'react';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App, { getFromLS, isMobile, saveToLS } from "./App";
import { registerSW } from 'virtual:pwa-register'
import { throttle, utils } from "./utils";
import Banis from "./Banis";
import Bani from "./Bani";
import './App.less'
import { Button, ButtonGroup, Checkbox, CircularProgress, Input, Link, Switch, Typography } from '@mui/joy';
import LiveAudio from "./LiveAudio";
import Shabads from "./Shabads";
import { toUnicode } from "gurmukhi-utils";
import Todo from "./Todo";
import JaapCounter from "./JaapCounter";
import { MenuItem, Select } from "@mui/material";

export const BaniContext = createContext({});
export enum SearchMethods {
  tuk = 'Search By Tuk',
  firstLetter = 'Search By First Letter'
}

function Main() {
  const updateSW = registerSW({
    onOfflineReady() { },
  })

  updateSW()

  const [expandCustomisations, setExpandCustomisations] = useState(false);
  const [shabadID, setShabadID] = useState()
  const [baniName, setBaniName] = useState('')
  const [mode, setMode] = useState(getFromLS('mode') ?? 'dark')
  const [statusText, setStatusText] = useState<any>();
  const [isWrap, setIsWrap] = useState(false);
  const [shabadTuk, setShabadTuk] = useState();

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(34);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [banis, setBanis] = useState([]);

  const [baniID, setBaniID] = useState()

  const showCustomisations = baniID || shabadID

  const [isEnglish, setIsEnglish] = useState(false)
  const [showPunjabiMeaning, setShowPunjabiMeaning] = useState(false);
  const [scrolling, setScrolling] = useState({ status: false, speed: 10 });
  const [search, setSearch] = useState('');
  const [installationPrompt, showInstallationPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event>();
  const [presenterMode, setPresenterMode] = useState(false);
  const [larivaarAssist, setLarivaarAssist] = useState({ state: false, lineIndex: 0, expand: false });
  const [heading, setHeading] = useState('')
  const [scrollPosition, setScrollPosition] = useState({ prev: 0, current: 0 });
  const [containerRef, setContainerRef] = useState<React.MutableRefObject<any>>()
  const [showFavourites, setShowFavourites] = useState(false);
  const [logo, setLogo] = useState({
    favourites: '💙'
  });
  const [searchMethod, setSearchMethod] = useState(SearchMethods['firstLetter']);
  const [showHistory, setShowHistory] = useState(false);

  const throttledScroll = throttle((e) => {
    setScrollPosition((val) => {
      return {
        prev: val.current,
        current: e.target.scrollTop
      }
    });
  }, 100);
  const setOpacity = () => {
    const { prev, current } = scrollPosition
    if (current < 20) return '1';
    if (scrolling.status || current < prev) return '0.9';
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "/beant-baaniyan",
      element: <Banis />
    },
    {
      path: "/bani",
      element: <Bani shabadId={shabadID} baniId={baniID} />
    },
    {
      path: '/live-audio',
      element: <LiveAudio />
    },
    {
      path: 'find-a-shabad',
      element: <Shabads />
    },
    {
      path: '/jaap-counter',
      element: <JaapCounter />
    }
  ]);

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

  const handleSearchMethod = (e) => {
    setSearchMethod(e.target.innerText);
  }

  const customisations = [
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Input placeholder="Search..." value={search} onChange={(e) => {
        setSearch(e.target.value.split(' ').join(''));
        handleInputChange(e);
      }} />
    </div>,
    <div key='displayMode' className='customisation'>
      <Typography className='switch'>Dark</Typography>
      <Switch className='switch' checked={mode === 'light'} onClick={(e) => {
        const modeVal = (e.target as HTMLInputElement).checked ? 'light' : 'dark'
        setMode(modeVal);
        saveToLS('mode', modeVal)
      }} />
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
    <div style={{ display: showCustomisations ? 'flex' : 'none' }} key={'isWrap'} className='customisation'>
      <Checkbox checked={isWrap} className='checkbox' onChange={(e) => setIsWrap(e.target.checked)} label='Wrap gurbani' />
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
    root.style.setProperty('--mainFontColor', '#ffffffbd')
    root.style.setProperty('--mainBackgroundColor', 'rgb(13 14 14)')
    root.style.setProperty('--titleFontColor', '#ff8282f0');
    root.style.setProperty('--gurmukhiMeaningsFontColor', '#ffa7facc')
    root.style.setProperty('--englishMeaningsFontColor', '#ffc6c6');
    root.style.setProperty('--larivaarAssistFontColor', '#f99090b5');
    root.style.setProperty('--headerBackgroundColor', '#6a6a6a45');
    root.style.setProperty('--headerFontColor', 'white');
    root.style.setProperty('--alternateBackground', '#424040');
    root.style.setProperty('--alternateFontColor', 'wheat');
  }
  if (mode === 'light') {
    root.style.setProperty('--mainFontColor', '#080808cc')
    root.style.setProperty('--mainBackgroundColor', '#b6b6b699')
    root.style.setProperty('--titleFontColor', 'rgb(153 77 0 / 81%)');
    root.style.setProperty('--gurmukhiMeaningsFontColor', '#714b00d9')
    root.style.setProperty('--englishMeaningsFontColor', '#5e3f00');
    root.style.setProperty('--larivaarAssistFontColor', '#544300d4');
    root.style.setProperty('--headerBackgroundColor', '#070030c9');
    root.style.setProperty('--headerFontColor', 'white');
    root.style.setProperty('--alternateBackground', '#424040');
    root.style.setProperty('--alternateFontColor', 'wheat');
  }

  const header = document.querySelector('.customisations') as HTMLElement;

  useEffect(() => {

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
      setFontSize(26);
    }
  }, [presenterMode])

  const handleFavourites = () => {
    if (location.pathname === '/bani') {
      const currFavourites = getFromLS('favourites') ?? [];
      const currentShabad = getFromLS('current');
      const shabadAlreadyPresent = currFavourites.filter((curr) => curr.shabadId === currentShabad.shabadId).length;
      if (!shabadAlreadyPresent) {
        const newFavourites = [currentShabad, ...currFavourites];
        alert('Favourite Added')
        saveToLS('favourites', newFavourites)
      }
      else {
        alert('Shabad removed from Favourites.')
        const newFavourites = [...currFavourites].filter((ele) => currentShabad.shabadId !== ele.shabadId);
        saveToLS('favourites', newFavourites);
      }
      return;
    }
    setShowFavourites(!showFavourites);
    setShowHistory(false);
  }

  if (!getFromLS('favouritesReversed')) {
    let fav = getFromLS('favourites'), hist = getFromLS('history');
    hist = (hist as [])?.reverse();
    fav = fav?.reverse();
    saveToLS('favourites', fav);
    saveToLS('history', hist);
    saveToLS('favouritesReversed', true)
  }

  if (!getFromLS('historyDeleted')) {
    localStorage.removeItem('history');
    saveToLS('historyDeleted', 'true');
  }

  const { fetchShabad, fetchMultipleShabads } = utils()

  useEffect(() => {
    const favourites = getFromLS('favourites');

    fetchMultipleShabads(favourites, 'All Favourites Fetched');
  }, [])

  return (
    <BaniContext.Provider value={{
      banis, setBanis, setMode, isLarivaar, mode, setIsLarivaar, fontSize,
      setFontSize, baniID, setBaniID, isEnglish, setIsEnglish,
      showEnglishMeaning, setShowEnglishMeaning, loading, setLoading,
      error, setError, showPunjabiMeaning, search, setSearch, presenterMode, setPresenterMode,
      setOpacity, throttledScroll, scrollPosition, setScrollPosition, scrolling, setScrolling, expandCustomisations, setExpandCustomisations
      , larivaarAssist, setLarivaarAssist, shabadID, setShabadID, setHeading, baniName, setBaniName,
      statusText, setStatusText, isWrap, setIsWrap, setContainerRef, showFavourites, setShowFavourites,
      shabadTuk, setShabadTuk, logo, setLogo, showHistory, searchMethod
    }}>
      <div className={expandCustomisations ? "expandCustomisations" : 'customisations'}>
        <div className={expandCustomisations ? "buttonGroupNoMarginTop" : 'buttonGroup'} >
          <svg onClick={() => setExpandCustomisations(!expandCustomisations)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" style={{ width: '30px' }} viewBox="0 0 50 50">
            <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"></path>
          </svg>

          {(isMobile || !expandCustomisations) && (
            <>
              <h1 style={{ fontWeight: 'bold' }}>{heading}</h1>
              {
                baniID && <button className="navigation" onClick={() => {
                  (containerRef?.current as HTMLElement).scrollTo({
                    top: 0,
                    behavior: "smooth"
                  })
                }}>🔝</button>
              }
              {logo && <h4 onClick={handleFavourites}>{logo.favourites}</h4>}
              {logo && <h6 className={'historyLogo'} onClick={() => { setShowHistory(!showHistory); setShowFavourites(false) }}>{logo.history}</h6>}
            </>
          )}

          {expandCustomisations && <>
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
      <RouterProvider router={router} />
    </BaniContext.Provider>
  );
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(<Main />);

