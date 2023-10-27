import { Button } from '@mui/joy'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

const Index = (props: Props) => {
  return (
    <div className='index center'>
        <Button onClick={() => {}} className='bani'>Sundar Gutka</Button>
        <Button className='bani'>Hukamnama</Button>
    </div>
  )
}

export default Index