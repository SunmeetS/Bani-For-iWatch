import React, { useEffect, useState } from 'react'
import { fetchBani, isTitle } from './utils';
import { useLocation } from 'react-router-dom';

const Bani = ({id}) => {
  !id ? id = useLocation().pathname.split('/')[1] : ''
  const [baniData, setBaniData] = useState({});
  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
    })
  }, [])

  const [isLarivaar, setIsLarivaar] = useState(false)

  return (
    <div className='App'>
      <input onClick={(e) => setIsLarivaar((e.target as HTMLInputElement).checked)} type="checkbox" name='larivaar'/>
        <label htmlFor="larivaar">Larivaar</label>
      {
        baniData?.verses?.map((verse, idx) => {
          let tuk: string = verse.verse.verse.unicode
          if(isLarivaar) tuk = tuk.split(' ').join(''); 
          let className = 'bani '
          if(isTitle(tuk) || idx === 0 ) className += 'title ';
          if(isLarivaar) className += 'larivaar '
          return (
            <div className={className}>
              {tuk}
            </div>
          )
        })
      }
    </div>
  )
}
export default Bani