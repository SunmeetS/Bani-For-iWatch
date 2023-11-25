import React, { useContext, useEffect, useState } from 'react'
import { Bani, isGurmukhiWord, removeMatras } from './utils';
import './App.less'
import { BaniContext } from './App.jsx'



const Banis = () => {
  const { banis, setBaniID, fontSize, isLarivaar, isEnglish, search, setSearch, expandCustomisations, setRoute } = useContext(BaniContext);
  const [filteredBanis, setFilteredBanis] = useState(banis as Bani[]);
  useEffect(() => {
    const filtered = banis.filter((bani) => {
      let searchFrom = (isGurmukhiWord(search) ? bani.gurmukhiUni : bani.transliteration).split(' ').join('');
      if (isGurmukhiWord(searchFrom)) {
        searchFrom = removeMatras(searchFrom);
        setSearch(removeMatras(search));
      }
      if (searchFrom.includes(search)) return bani
    })
    setFilteredBanis(filtered)
  }, [search]);
  const isMobile = window.innerWidth <= 425
  return (
    <div key={'Banis'} className='Banis' style={(expandCustomisations && !isMobile) ? { position: 'absolute', left: '15%', transition: '0.5s all' } :
      { position: 'absolute', left: '0', transition: '0.5s all' }}>
      {
        (filteredBanis?.length ? filteredBanis : banis)?.map((bani) => {
          let tuk = bani.gurmukhiUni,
            englishTuk = bani.transliteration;
          if (isLarivaar) tuk = tuk.split(' ').join('');
          return <div
            onClick={() => {
              setBaniID(bani.ID);
              setRoute('Read a Bani')
            }}
            style={{ fontSize: fontSize }}
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
