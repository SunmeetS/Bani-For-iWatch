import React, { useContext, useEffect, useRef, useState } from 'react'
import { getFirstLetters, removeMatras, utils } from './utils';
import { useLocation } from 'react-router-dom';
import { BaniContext } from './App.jsx'


const Bani = ({ id }) => {

  useEffect(() => {
    return () => {
      () => setBaniID(null);
    }
  })
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({verses: []});
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning, setLoading, setError, 
  showPunjabiMeaning, presenterMode, search, opacity, setOpacity, throttledScroll, scrollPosition, 
  setScrollPosition, scrolling, setScrolling, expandCustomisations,larivaarAssist, setLarivaarAssist } = useContext(BaniContext) ?? {}
  const {fetchBani} = utils(setError, setLoading);
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
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
    containerRef?.current?.focus();
    containerRef?.current?.addEventListener('scroll', throttledScroll)
  }, [])

  useEffect(() => {
    handleSearch()
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
    const verses = baniData?.verses || [];
    for (let i = 0; i < verses.length; i++) {
      const tuk = removeMatras(verses?.[i]?.verse?.verse?.unicode);
      const tukFirstLetters: string = getFirstLetters(tuk).join('');
      const firstLettersSearch: string = removeMatras(search).split(' ').join('')
      if (tukFirstLetters?.includes(firstLettersSearch)) {
        setFoundShabadIndex({previous: foundShabadIndex?.current, current: i});
        scrollToFoundShabad();
        break;
      }
    }
  };

  const isMobile = window.innerWidth < 425

  return (
    <div className='Bani' ref={containerRef}>
      {baniData?.verses?.map(({ verse, header }, idx) => {
        const tuk = verse.verse.unicode.split(' '),
        englishTuk = verse.transliteration.en,
        {bdb: en1, ms: en2, ssk: en3} = verse?.translation?.en ?? {},
        englishMeaning = en1 ?? en2 ?? en3 ;
        let {bdb: pu1, ft: pu2, ms: pu3, ss: pu4} = verse?.translation?.pu ?? {},
        punjabiMeaning = pu1 ?? pu2 ?? pu3 ?? pu4
        punjabiMeaning = punjabiMeaning.unicode
        let className = `tuk ${isEnglish ? '' : isLarivaar ? 'larivaar ' : ''}
          ${header || idx === 0 ? 'title' : ''}`;
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
              {isEnglish ? englishTuk: tuk.map((ele, index) => 
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
      })}
    </div>
  );
}
export default Bani