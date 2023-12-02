import React, { useContext, useEffect, useState } from 'react'
import { BaniContext } from './main'
import { Button, CircularProgress, Input } from '@mui/joy'
import './App.less'
import { utils } from './utils'
import { toEnglish, toUnicode } from 'gurmukhi-utils'
import { useNavigate } from 'react-router-dom'

type Props = {}

const Shabads = (props: Props) => {

    const [shabads, setShabads] = useState({ verses: [] });
    const [searchInput, setSearchInput] = useState('');
    const { shabadID, setShabadID, setHeading, setSearch, setBaniName, search, statusText, setStatusText, isEnglish} = useContext(BaniContext);
    const { fetchShabads } = utils()
    const navigate = useNavigate()

    useEffect(() => {
        return(
            () => {
                setStatusText(null)
            }
        )
    }, [])

    useEffect(() => {setShabadID}, [shabadID])

    const updateShabads = () => {
        setStatusText?.(<CircularProgress style={{margin: '1rem'}} />)
        fetchShabads(search).then((shabads) => {
            if(shabads.verses.length === 0) setStatusText('No Shabads Found');
            else setStatusText(null)
            setShabads(shabads);
        }).catch(() => setStatusText('Please Try Again'))
    }

    return (
       <div className="App">
         <div className='shabad-main Banis'>
            {
                !shabadID && <>
                    <div className="inputGroup">
                        <Input value={searchInput} onChange={(e) => {
                            const inputText = e.target.value;
                            const gurmukhiText = toUnicode(inputText);
                            setSearchInput(gurmukhiText);
                            setSearch(gurmukhiText)
                        }} 
                        placeholder='ਗ ਮ ਸ ਸ ਹ ਨ' />
                        <Button onClick={(e) => {
                            updateShabads();
                        }}>Search Shabad</Button>
                    </div>
                    {
                        statusText && <h1>{statusText}</h1> }
                        {shabads?.verses?.map((shabad) => {
                            const tuk = shabad.verse.unicode
                            const baniName = (tuk as string).split(' ').slice(0, 6).join('');
                            const englishTuk = toEnglish(tuk)
                            return (
                                <>
                                    <h1 onClick={() => {
                                        setShabadID(shabad.shabadId);
                                        setBaniName(baniName);
                                        setHeading(baniName)
                                        navigate('/bani')
                                    }} className='bani'>
                                        {isEnglish ? englishTuk : tuk}
                                    </h1>
                                </>
                            )
                        })
                    }
                </>
            }
        </div>
       </div>
    )
}

export default Shabads