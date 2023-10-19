import React, { useContext, useState } from 'react'
import { Bani } from './utils';
import { useNavigate } from 'react-router-dom';
import './App.css'
import { Switch, Typography  } from '@mui/joy';
import {BaniContext} from './App.jsx'



const Banis = () => {
  const {banis, setBanis, setMode, setBaniID, fontSize, isLarivaar, isEnglish} = useContext(BaniContext);

  return (
    <div key={'Banis'} className='Banis'>
      {
        banis?.map((bani) =>
          {  
            let tuk = bani.gurmukhiUni, 
            englishTuk = bani.transliteration;
            if (isLarivaar) tuk = tuk.split(' ').join('');
            return <div
              onClick={() => {
                setBaniID(bani.ID);
              }}
              style={{fontSize: fontSize}}
              key={bani.ID}
              className='bani'>
              {isEnglish ? englishTuk : tuk}
            </div>
          }
        )
      } 
    </div>
  )
}

export default Banis
