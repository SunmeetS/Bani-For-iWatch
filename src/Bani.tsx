import React, { useContext, useEffect, useState } from 'react'
import { fetchBani } from './utils';
import { useLocation } from 'react-router-dom';
import { Checkbox, ButtonGroup, Button } from '@mui/joy';
import { BaniContext } from './App.jsx'



const Bani = ({ id }) => {

  useEffect(() => {
    return () => {
      () => setBaniID(null);
    }
  })
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({});
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning } = useContext(BaniContext) ?? {}
  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
  }, [])

  return (
    <div className='Bani'>
      {baniData?.verses?.map(({ verse, header }, idx) => {
        const tuk = isLarivaar ? verse.verse.unicode.replace(/ /g, '') : verse.verse.unicode,
        englishTuk = verse.transliteration.en,
        englishMeaning = verse?.translation?.en?.ms;
        const className = `tuk ${isEnglish ? '' : isLarivaar ? 'larivaar ' : ''}
          ${header || idx === 0 ? 'title' : ''}`;
        return (
          <div
            className={className}
            style={{
              fontSize: fontSize
            }}
          >
            {isEnglish ? englishTuk : tuk}
            {showEnglishMeaning && <p style={{fontSize: fontSize/2}} className='meanings'>{englishMeaning}</p>}
          </div>
        );
      })}
    </div>
  );
}
export default Bani