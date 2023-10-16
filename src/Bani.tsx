import React, { useEffect, useState } from 'react'
import { fetchBani } from './utils';
import { useLocation } from 'react-router-dom';
import { Checkbox, ButtonGroup, Button } from '@mui/joy';


const Bani = ({id}) => {
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({});
  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
  }, [])

  const [isLarivaar, setIsLarivaar] = useState(false)
  let [fontSize, setFontSize] = useState(20);

  const customisations = [
    <div className='customisation'>
      <Checkbox onChange={(e) => setIsLarivaar((e.target as HTMLInputElement).checked)} label='Larivaar'/>
    </div>,
    <div className='customisation'>
     <ButtonGroup size='sm' aria-label="Font Size">
      <Button onClick={() => setFontSize(fontSize+1)}>+</Button>
      <Button >{fontSize}</Button>
      <Button onClick={() => setFontSize(fontSize-1)}>-</Button>
    </ButtonGroup>
   </div>,
  ]

  return (
    <div className='App'>
     <div className='customisations'>
        {customisations.map((ele) => ele)}
     </div>
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