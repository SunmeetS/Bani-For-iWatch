import React, { useEffect, useState } from 'react'
import { fetchBani } from './utils';
import { useLocation } from 'react-router-dom';

const Bani = ({id}) => {
  !id ? id = useLocation().pathname : ''
  const [baniData, setBaniData] = useState({});

  useEffect(() => {
    fetchBani(id).then(bani => {
      setBaniData(bani)
      console.log(bani)
    })
  }, [])

  useEffect(() => {
    console.log(baniData)
  }, baniData)

  return (
    <div>
      {
        baniData?.verses?.map(verse => <div>{verse.verse.verse.unicode}</div>)
      }
    </div>
  )
}
export default Bani