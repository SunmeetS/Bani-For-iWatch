import React, { useContext, useEffect, useState } from 'react'
import { Bani, baniCache, isGurmukhiWord, removeMatras, utils } from './utils';
import './App.less'
import { BaniContext } from './main.jsx'
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import { getFromLS, saveToLS } from './App';

const Banis = () => {
  const { banis, setBanis, setBaniID, fontSize, isLarivaar, isEnglish, search, setSearch, expandCustomisations, setHeading, setBaniName } = useContext(BaniContext);
  const [filteredBanis, setFilteredBanis] = useState(banis as Bani[]);
  const { fetchBanis, fetchMultiple } = utils();

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
    let banis = getFromLS('banis');
    if (banis) {
      setBanis(banis);
      fetchAllBanis()
      return;
    }
    setLoading(true);
    fetchBanis().then(banis => {
      saveToLS('banis', banis);
      setBanis(banis)
      fetchAllBanis()
    })

    function fetchAllBanis() {
      fetchMultiple(banis?.map(({ ID }) => { return { baniId: ID } }), 'Error in Pre-Fetching Banis', 'bani');
    }
  }, [])

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
                className='bani baniName'>
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
