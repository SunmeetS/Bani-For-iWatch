import React, { useContext, useEffect, useRef, useState } from 'react'
import { getFirstLetters, removeMatras, utils } from './utils';
import { BaniContext, isMobile } from './App.jsx'
import { Button } from '@mui/joy';


const Bani = ({ baniId, shabadId }) => {

  useEffect(() => {
    return () => {
      () => setBaniID(null);
      () => setShabadID(null)
    }
  }, [])
  const [baniData, setBaniData] = useState({
    details: [],
    previous: '',
    next: '',
});
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning, setLoading, setError, 
  showPunjabiMeaning, presenterMode, search, throttledScroll,  
  scrolling, expandCustomisations,larivaarAssist, setLarivaarAssist, setShabadID } = useContext(BaniContext) ?? {}
  const {fetchBani, fetchShabad} = utils();
  const [foundShabadIndex, setFoundShabadIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
  
    if (scrolling.status) {
      if (!interval) {
        interval = setInterval(() => {
          containerRef?.current.scrollBy({
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

  useEffect(() => {
    if(baniId) {
      fetchBani(baniId).then(bani => {
        setBaniData(bani);
        handleSearch();
      })
    }

    if(shabadId) {
      fetchShabad(shabadId).then((data) => {
        setBaniData(data as any);
        handleSearch();
      });
    }
    
    containerRef?.current?.focus();
    containerRef?.current?.addEventListener('scroll', throttledScroll)
  }, [shabadId, baniId])

  useEffect(() => {
    if(search) handleSearch()
  }, [search])

  const scrollToFoundShabad = () => {
    if (foundShabadIndex !== null) {
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

  const handleSearch = () => {
    for (let i = 0; i < baniData.details.length; i++) {
      const tuk = removeMatras(baniData?.details?.[i]?.tuk);
      const tukFirstLetters: string = getFirstLetters(tuk).join('');
      const firstLettersSearch: string = removeMatras(search).split(' ').join('')
      if (tukFirstLetters?.includes(firstLettersSearch)) {
        setFoundShabadIndex({previous: foundShabadIndex?.current, current: i});
        scrollToFoundShabad();
        break;
      }
    }
  };

  return (
    <div className='Bani' ref={containerRef}>
      {baniData?.details?.map((verse, idx) => {

        let {tuk, englishTuk, englishMeaning, punjabiMeaning} = verse ?? {}

        tuk = tuk?.split(' ');

        let className = `tuk ${isEnglish ? '' : isLarivaar ? 'larivaar ' : ''}
          ${ idx === 0 ? 'title' : ''}`;
        if(presenterMode) className = 'presenter'; 
        
        return (
          <div
            className={className}
            style={(!isMobile && expandCustomisations) ? {
              transition: '0.5s all',
              fontSize: fontSize,
              position: 'relative',
              left: '30%',
              width: 'calc(100vw - 50%)',
              overflowX: 'hidden',
              overflowY: 'scroll',
            } :{
              fontSize: fontSize,
              transition: '0.5s all',
              position: 'relative',
              left: '0%',
            }}
          >
            <h4 onClick={() => {              
              if(isLarivaar) {
                setLarivaarAssist({...larivaarAssist, lineIndex: idx, expand: true});
                setTimeout(() => {
                  setLarivaarAssist({...larivaarAssist, lineIndex: null, expand: false})
                }, 5000);
              }
            }}>
              {isEnglish ? englishTuk: tuk?.map((ele, index) => 
              {
                return (
                  <span className={(larivaarAssist.state && index % 2) ? 'larivaarAssist' : ''} style={
                    {
                      marginRight: (larivaarAssist.expand && larivaarAssist.lineIndex === idx) && '10px', 
                      transition: 'margin 0.5s',
                    }
                    }>{ele + (!isLarivaar ? " " : '')}</span>)}
                )
              }
            </h4>
          <div className="meaningsGroup">
              {showEnglishMeaning && <p style={{fontSize: fontSize/2}} className='englishMeanings'>{englishMeaning}</p>}
              {showPunjabiMeaning && <p style={{fontSize: fontSize/1.5}} className='gurmukhiMeanings'>{punjabiMeaning}</p>}
            </div>
          </div>
        );
      }
      )}

      {
        shabadId && <div className='shabadNavigation tuk'>
          <Button onClick={() => {
            setShabadID(baniData.previous)
          }}>{'Previous'}</Button>
          <Button onClick={() => {
            setShabadID(baniData.next)
          }}>{'Next'}</Button>
        </div>
      }

    </div>
  );
}
export default Bani