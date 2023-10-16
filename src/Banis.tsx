import React, { useContext, useState } from 'react'
import { Bani, fetchBanis } from './utils';
import { useNavigate } from 'react-router-dom';
import './App.css'
import { BaniContext } from './App';


const Banis = () => {
  const {banis, setBanis} = useContext(BaniContext);
  const history = useNavigate();

  if (!banis.length) fetchBanis().then(banis => setBanis(banis))

  return (
    <div className='App'>
      {
        banis.map((bani) =>
          <button
            onClick={() => history('/'+bani.ID)}
            className='bani'>
            {bani.gurmukhiUni}
          </button>
        )
      } 
    </div>
  )
}

export default Banis
