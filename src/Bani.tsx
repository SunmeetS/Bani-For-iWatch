import React, { useContext, useEffect, useState } from 'react'
import { fetchBani } from './utils';
import { useLocation } from 'react-router-dom';
import { Checkbox, ButtonGroup, Button } from '@mui/joy';
import {BaniContext} from './App.jsx'



const Bani = ({id}) => {
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({});
  const {isLarivaar, fontSize} = useContext(BaniContext) ?? {}
  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
  }, [])

  return (
    <div className='App'>
      {
        baniData?.verses?.map((verse, idx) => {
          let tuk: string = verse.verse.verse.unicode
          if(isLarivaar) tuk = tuk.split(' ').join(''); 
          let className = 'bani '
          if(verse.header || idx === 0 ) className += 'title ';
          if(isLarivaar) className += 'larivaar '
          return (
            <div tabIndex={1} className={className}
              style={{
                fontSize: fontSize
              }}
            >
              {tuk}
            </div>
          )
        })
      }
    </div>
  )
}
export default Bani