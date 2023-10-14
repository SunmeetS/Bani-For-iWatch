import React, { useEffect, useState } from 'react'
import { Bani, fetchBani, fetchBanis } from './utils';
import { Router, useNavigate } from 'react-router-dom';


const Banis = () => {
  const [banis, setBanis] = useState(Array<Bani>);
  const history = useNavigate();

  console.log('first')


  if (!banis.length) fetchBanis().then(banis => setBanis(banis))

  return (
    <div>
      {
        banis.map((bani) =>
          <div
            onClick={() => history('/'+bani.ID)}
            className='bani'>
            {bani.gurmukhiUni}
          </div>
        )
      } 
    </div>
  )
}

export default Banis
