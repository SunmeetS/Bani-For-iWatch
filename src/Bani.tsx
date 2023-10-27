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
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning, setLoading, setError, showPunjabiMeaning, presenterMode, search, setSearch } = useContext(BaniContext) ?? {}
  const {fetchBani} = utils(setError, setLoading);
  const [foundShabadIndex, setFoundShabadIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
  }, [])

  useEffect(() => {
    handleSearch()
  }, [search])

  const scrollToFoundShabad = () => {
    if (foundShabadIndex !== null) {
      const shabadChildren: (HTMLElement | undefined)[] = containerRef.current.children
      const prevShabad = shabadChildren[foundShabadIndex?.previous] ?? {style: {}}
      const shabadElement = shabadChildren[foundShabadIndex?.current];
      prevShabad.style.backdropFilter = 'brightness(100%)'
      shabadElement.style.backdropFilter = 'brightness(60%)'
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


  return (
    <div className='Bani' ref={containerRef}>
      {baniData?.verses?.map(({ verse, header }, idx) => {
        const tuk = isLarivaar ? verse.verse.unicode.replace(/ /g, '') : verse.verse.unicode,
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
            style={{
              fontSize: fontSize
            }}
          >
            <span>{isEnglish ? englishTuk : tuk}</span>
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