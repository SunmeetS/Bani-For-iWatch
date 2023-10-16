import React, { useContext, useState } from 'react'
import { Bani, fetchBanis } from './utils';
import { useNavigate } from 'react-router-dom';
import './App.css'
import { Switch, Typography  } from '@mui/joy';
import App from './App.jsx'



const Banis = () => {
  const {banis, setBanis, setMode} = useContext(BaniContext);
  const history = useNavigate();

  if (!banis.length) fetchBanis().then(banis => setBanis(banis))
  return (
    <div key={'Banis'} className='Banis'>
      {
        banis.map((bani) =>
          <button
            onClick={() => history('/'+bani.ID)}
            key={bani.ID}
            className='bani'>
            {bani.gurmukhiUni}
          </button>
        )
      } 
    </div>
  )
}

export default Banis
