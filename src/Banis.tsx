import React, { useContext, useEffect, useState } from 'react'
import { Bani, baniCache, isGurmukhiWord, removeMatras, utils } from './utils';
import './App.less'
import { BaniContext } from './main.jsx'
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';

const Banis = () => {
  const { banis, setBanis, setBaniID, fontSize, isLarivaar, isEnglish, search, setSearch, expandCustomisations, setHeading, setBaniName } = useContext(BaniContext);
  const [filteredBanis, setFilteredBanis] = useState(banis as Bani[]);
  const {fetchBani, fetchBanis} = utils();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filtered = banis?.filter((bani) => {
      let searchFrom = (isGurmukhiWord(search) ? bani.gurmukhiUni : bani.transliteration).split(' ').join('');
      if (isGurmukhiWord(searchFrom)) {
        searchFrom = removeMatras(searchFrom);
        setSearch(removeMatras(search));
      }
      if (searchFrom.includes(search)) return bani
    })
    setFilteredBanis(filtered)
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchBanis().then(banis => {
      setBanis(banis)
    })
  }, [])

  useEffect(() => {
    Promise.all(banis?.map(async (bani) => {
      if(!baniCache.bani[bani.ID]) {
        let res = fetchBani(bani.ID);
        baniCache.bani[bani.ID] = true;
        return res
      }
    })).then(() => {
      setLoading(false);
    })
    .catch(() => {
      console.log('error in pre-fetching the banis')
      setLoading(false);
    })
  }, [banis])

  const navigate = useNavigate()

  const isMobile = window.innerWidth <= 425
  return (
   <div className='App'>
    <div key={'Banis'} className='Banis'>
      {
        loading ? <CircularProgress /> : 
        (filteredBanis?.length ? filteredBanis : banis)?.map((bani) => {
          let tuk = bani.gurmukhiUni, englishTuk = bani.transliteration;
          if (isLarivaar) tuk = tuk.split(' ').join('');
          return <div
            onClick={() => {
              setBaniID(bani.ID);
              setBaniName(tuk)
              setHeading(tuk)
              navigate('/bani')
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
   </div>
  )
}

export default Banis
