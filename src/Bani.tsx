import React, { useContext, useEffect, useState } from 'react'
import { utils } from './utils';
import { useLocation } from 'react-router-dom';
import { Checkbox, ButtonGroup, Button } from '@mui/joy';
import { BaniContext } from './App.jsx'
import { lightGreen } from '@mui/material/colors';



const Bani = ({ id }) => {

  useEffect(() => {
    return () => {
      () => setBaniID(null);
    }
  })
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({});
  const { isLarivaar, fontSize, setBaniID, isEnglish, showEnglishMeaning, setLoading, setError, showPunjabiMeaning } = useContext(BaniContext) ?? {}
  const {fetchBani} = utils(setError, setLoading)
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
        {bdb: en1, ms: en2, ssk: en3} = verse?.translation?.en ?? {},
        englishMeaning = en1 ?? en2 ?? en3 ;
        let {bdb: pu1, ft: pu2, ms: pu3, ss: pu4} = verse?.translation?.pu ?? {},
        punjabiMeaning = pu1 ?? pu2 ?? pu3 ?? pu4
        punjabiMeaning = punjabiMeaning.unicode
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
          <div className="meaningsGroup">
              {showEnglishMeaning && <p style={{fontSize: fontSize/2, color: 'lightcyan'}} className='meanings'>{englishMeaning}</p>}
              {showPunjabiMeaning && <p style={{fontSize: fontSize/1.5, color: 'lightGreen'}} className='meanings'>{punjabiMeaning}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Bani