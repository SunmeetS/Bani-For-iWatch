import React, { useContext, useEffect, useRef, useState } from 'react'
import { getFirstLetters, removeMatras, utils } from './utils';
import { BaniContext } from './main';
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
  scrolling,larivaarAssist, setLarivaarAssist, setShabadID, 
  statusText, setStatusText, setHeading, isWrap, setContainerRef, shabadTuk, setShabadTuk } = useContext(BaniContext) ?? {}
  const {fetchBani, fetchShabad} = utils();
  const [foundShabadIndex, setFoundShabadIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setContainerRef(containerRef)
  }, [])

  useEffect(() => {
    if(!baniId && !shabadId){
      const { baniId, shabadId } = getFromLS('current');

      if (baniId) {
        setBaniID(baniId);
      }

      if (shabadId) {
        setShabadID(shabadId);
      }
    }
    setStatusText(<CircularProgress style={{margin: '1rem'}} />)
    return () => {
      setBaniID(null);
      setShabadID(null);
      setStatusText(null);
      setHeading('')
      setShabadTuk(null)
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
    if(baniId) {
      fetchBani(baniId).then(bani => {
        setBaniData(bani);
        setStatusText(null);
        saveToLS('current', {baniId});
      }).catch(() => {
        setStatusText('Failed to load Bani data');
      })
    }

    if(shabadId) {
      fetchShabad(shabadId).then(async (data) => {
        setBaniData(data as any);
        setStatusText(null);
        saveToLS('current', {shabadId, shabadTuk});
        const fetchPromises = [];

        for (let i = 0; i < 10; i++) {
          fetchPromises.push(fetchShabad(shabadId - i));
          fetchPromises.push(fetchShabad(shabadId + i));
        }

        Promise.all(fetchPromises).then(() => {});
      }).catch(() => {
        setStatusText('Failed to load Shabad data')
      });
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
      if(prevShabad) {
        prevShabad.classList.remove('foundShabad')
      }
      shabadElement.classList.add('foundShabad')
      if (shabadElement) {
        shabadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSearch = (bani = null) => {
    if(bani) baniData = bani;
    for (let i = 0; i < baniData.details.length; i++) {
      const tuk = baniData?.details?.[i]?.tuk;
      const tukWithoutMatras = removeMatras(tuk);
      const tukFirstLetters: string = (getFirstLetters(tukWithoutMatras).join(''));
      const firstLettersSearch: string = removeMatras(search).split(' ').join('');
      if (tukFirstLetters?.includes(firstLettersSearch) || tuk === shabadTuk ) {
        if(shabadId) setShabadTuk(tuk);
        setFoundShabadIndex({previous: foundShabadIndex?.current, current: i});
        scrollToFoundShabad();
        break;
      }
    }
  };

  let className = `tuk ${isEnglish ? '' : isLarivaar ? 'larivaar ' : ''}`
  const wrapTuk = [];
  baniData?.details?.forEach(({tuk}) => wrapTuk.push(...tuk.split(' ')))

  return (
    <div className='App'>
      <div className='Bani' ref={containerRef}>
        {statusText && statusText}

        {isWrap && wrapTuk.map((ele, index) => {
          return (
            <span style={{fontSize: fontSize}} className={(larivaarAssist.state && index % 2) ? 'larivaarAssist' : ''}>
              {ele + (!isLarivaar ? " " : '')}
            </span>
          )
        })}
        
        {!isWrap && baniData?.details?.map((verse, idx) => {

          let {tuk, englishTuk, englishMeaning, punjabiMeaning} = verse ?? {}

          tuk = tuk?.split(' ');

          let className2 = className;

          idx === 0 ? className2 += 'title' : '';
          if(presenterMode) className2 = 'presenter'; 
          
          return (
            <div
              className={className2}
              
            >
              <h4 onClick={() => {              
                if(isLarivaar) {
                  setLarivaarAssist({...larivaarAssist, lineIndex: idx, expand: true});
                  setTimeout(() => {
                    setLarivaarAssist({...larivaarAssist, lineIndex: null, expand: false})
                  }, 5000);
                }
              }}>
                {isEnglish ? englishTuk: tuk?.map((ele: string, index: number) => 
                {
                  return (
                    <span className={(larivaarAssist.state && index % 2 && idx != 0) ? 'larivaarAssist' : ''} style={
                      {
                        marginRight: (larivaarAssist.expand && larivaarAssist.lineIndex === idx) && '10px', 
                        transition: 'margin 0.5s',
                        fontSize: fontSize
                      }
                      }>{ele + (!isLarivaar ? " " : '')}</span>)}
                  )
                }
              </h4>
             { (englishMeaning || punjabiMeaning) && <div className="meaningsGroup">
                {showEnglishMeaning && <p style={{fontSize: fontSize/2}} className='englishMeanings'>{englishMeaning}</p>}
                {showPunjabiMeaning && <p style={{fontSize: fontSize/1.5}} className='gurmukhiMeanings'>{punjabiMeaning}</p>}
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