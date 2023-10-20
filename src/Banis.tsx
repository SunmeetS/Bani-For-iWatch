import React, { useContext, useEffect, useState } from 'react'
import { Bani, isGurmukhiWord } from './utils';
import './App.css'
import {BaniContext} from './App.jsx'



const Banis = () => {
  const {banis, setBanis, setMode, setBaniID, fontSize, isLarivaar, isEnglish, search, setSearch} = useContext(BaniContext);

  const [filteredBanis, setFilteredBanis] = useState(banis as Bani[]);
  useEffect(() => {
    const filtered = banis.filter((bani) => {
      let searchFrom = (isGurmukhiWord(search) ? bani.gurmukhiUni: bani.transliteration).split(' ').join('')
      if (searchFrom.includes(search)) return bani
    })
    setFilteredBanis(filtered)
  }, [search]);  
  return (
    <div key={'Banis'} className='Banis'>
      {
      (filteredBanis.length ? filteredBanis: banis)?.map((bani) =>
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
