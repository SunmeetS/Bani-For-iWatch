import React, { useContext, useEffect, useRef, useState } from 'react'
import { getFirstLetters, removeMatras, utils } from './utils';
import { BaniContext, SearchMethods } from './main';
import { Button, CircularProgress } from '@mui/joy';
import { getFromLS, saveToLS } from './App';


const Bani = ({ baniId, shabadId }) => {

  let [baniData, setBaniData] = useState({
    details: [],
    previous: '',
    next: '',
  });
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning, setError,
    showPunjabiMeaning, presenterMode, search, throttledScroll,
    scrolling, larivaarAssist, setLarivaarAssist, setShabadID,
    statusText, setStatusText, setHeading, isWrap, setContainerRef, shabadTuk, setShabadTuk,
    setLogo, searchMethod, setLoading, vishraams
  } = useContext(BaniContext) ?? {}
  const { fetchBani, fetchShabad, fetchShabads } = utils();
  const [foundShabadIndex, setFoundShabadIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setContainerRef(containerRef)
  }, [])

  useEffect(() => {
    if (!baniId && !shabadId) {
      const { baniId, shabadId } = getFromLS('current');

      if (baniId) {
        setBaniID(baniId);
      }

      if (shabadId) {
        setShabadID(shabadId);
      }
    }
    setStatusText(<CircularProgress style={{ margin: '1rem' }} />)
    return () => {
      setBaniID(null);
      setShabadID(null);
      setStatusText(null);
      setHeading('')
      setShabadTuk(null)
      setLogo();
    }
  }, [])

  useEffect(() => {
    let interval;

    if (scrolling?.status) {
      if (!interval) {
        interval = setInterval(() => {
          containerRef?.current.scrollBy({
            top: scrolling?.speed,
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
  }, [scrolling?.status, scrolling?.speed]);

  useEffect(() => {
    if (baniId) {
      fetchBani(baniId).then(bani => {
        setBaniData(bani);
        setStatusText(null);
        saveToLS('current', { baniId });
      }).catch(() => {
        setStatusText('Failed to load Bani data');
      })
    }

    if (shabadId) {
      const currentHistory = getFromLS('history') ?? [];
      const shabadAlreadyPresent = currentHistory.filter((curr) => curr.shabadId === shabadId).length > 0;
      fetchShabad(shabadId).then(async (data) => {
        setBaniData(data as any);
        setStatusText(null);
        const shabadTuk = data.details[2].tuk;
        if (!shabadAlreadyPresent) saveToLS('history', [{ shabadId, shabadTuk }, ...currentHistory]);
        saveToLS('current', { shabadId, shabadTuk });
        const fetchPromises = [];

        for (let i = 0; i < 10; i++) {
          fetchPromises.push(fetchShabad(shabadId - i));
          fetchPromises.push(fetchShabad(shabadId + i));
        }

        Promise.all(fetchPromises).then(() => { });
      }).catch(() => {
        setStatusText('Failed to load Shabad data')
      });
      setLogo({ favourites: '💙' });
    }

    containerRef?.current?.focus();
    containerRef?.current?.addEventListener('scroll', throttledScroll)
  }, [shabadId, baniId, shabadTuk])

  useEffect(() => {
    handleSearch()
  }, [baniData, search])

  useEffect(() => {
    scrollToFoundShabad()
  }, [foundShabadIndex])

  const scrollToFoundShabad = () => {
    if (foundShabadIndex?.current) {
      const shabadChildren: (HTMLElement | undefined)[] = containerRef.current.children
      const prevShabad = shabadChildren[foundShabadIndex?.previous]
      const shabadElement = shabadChildren[foundShabadIndex?.current];
      if (prevShabad) {
        prevShabad.classList.remove('foundShabad')
      }
      shabadElement.classList.add('foundShabad')
      if (shabadElement) {
        shabadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSearch = (bani = null) => {
    if (bani) baniData = bani;
    for (let i = 0; i < baniData.details.length; i++) {
      let tuk = baniData?.details?.[i]?.tuk;
      const tukWithoutMatras = removeMatras(tuk);
      const tukFirstLetters: string = (getFirstLetters(tukWithoutMatras).join(''));
      const firstLettersSearch: string = removeMatras(search).split(' ').join('');

      if (searchMethod === SearchMethods.tuk) {
        if (removeMatras(tuk).includes(removeMatras(search))) {
          setFoundShabadIndex({ previous: foundShabadIndex?.current, current: i });
          scrollToFoundShabad();
          break;
        }
      }

      else {
        if (tukFirstLetters?.includes(firstLettersSearch) || tuk === shabadTuk) {
          if (shabadId) setShabadTuk(tuk);
          setFoundShabadIndex({ previous: foundShabadIndex?.current, current: i });
          scrollToFoundShabad();
          break;
        }
      }
    }
  };

  let className = `tuk ${isEnglish ? '' : isLarivaar ? 'larivaar ' : ''}`
  const wrapTuk = [];
  baniData?.details?.forEach(({ tuk }) => wrapTuk.push(...tuk.split(' ')))
  const timeoutRef = useRef(null);

  return (
    <div className='App'>
      <div className='Bani' ref={containerRef}>
        {statusText && statusText}

        {isWrap && wrapTuk.map((ele, index) => {
          return (
            <span style={{ fontSize: fontSize }} className={(larivaarAssist.state && index % 2) ? 'larivaarAssist' : ''}>
              {ele + (!isLarivaar ? " " : '')}
            </span>
          )
        })}

        {!isWrap && baniData?.details?.map((verse, idx) => {

          let { tuk, englishTuk, englishMeaning, punjabiMeaning, vishraam } = verse ?? {}
          const vishraamIndexMajor = vishraam?.[0]?.p, vishraamIndexMinor = vishraam?.[1]?.p; console.log(tuk, vishraamIndexMinor)

          tuk = tuk?.split(' ');

          let className2 = className;

          idx === 0 ? className2 += 'title' : '';
          if (presenterMode) className2 = 'presenter';
          return (
            <div
              className={className2}
            >
              <h4 onClick={() => {

                if (isLarivaar) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setLarivaarAssist({ ...larivaarAssist, lineIndex: idx, expand: true });
                  timeoutRef.current = setTimeout(() => {
                    setLarivaarAssist({ ...larivaarAssist, lineIndex: null, expand: false })
                  }, 5000);
                }
              }}>
                {isEnglish ? englishTuk : tuk?.map((ele: string, index: number) => {
                  return (
                    <span className={`${(larivaarAssist.state && index % 2 && idx != 0) && 'larivaarAssist'} ${(vishraamIndexMajor === index && vishraams) && 'vishraamMajor'} ${(vishraamIndexMinor === index && vishraams) && 'vishraamMinor'}`} style={
                      {
                        marginRight: (larivaarAssist.expand && larivaarAssist.lineIndex === idx) && '10px',
                        transition: 'margin 0.5s',
                        fontSize: fontSize,
                      }
                    }>{ele + (!isLarivaar ? " " : '')}</span>)
                }
                )
                }
              </h4>
              {(englishMeaning || punjabiMeaning) && <div className="meaningsGroup">
                {showEnglishMeaning && <p style={{ fontSize: fontSize / 2 }} className='englishMeanings'>{englishMeaning}</p>}
                {showPunjabiMeaning && <p style={{ fontSize: fontSize / 1.5 }} className='gurmukhiMeanings'>{punjabiMeaning}</p>}
              </div>}
            </div>
          );
        }
        )}

        {
          shabadId && <div className='shabadNavigation'>
            <Button onClick={() => {
              setShabadID(baniData.previous)
            }}>{'Previous'}</Button>
            <svg onClick={(e) => {
              const promptResp = prompt('Go to Shabad :');
              setStatusText(<CircularProgress />)
              setLoading(true)
              fetchShabads(promptResp).then((res) => {
                setShabadID(res.verses[0].shabadId);
                setShabadTuk(res.verses[0].larivaar.unicode);
                handleSearch()
                setLoading(false)
              })
            }} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
            </svg>
            <Button onClick={() => {
              setShabadID(baniData.next)
              containerRef.current.scrollTop = 0
            }}>{'Next'}</Button>
          </div>
        }

      </div>
    </div>
  );
}
export default Bani