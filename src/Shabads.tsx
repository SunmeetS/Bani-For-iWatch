import React, { useContext, useEffect, useState } from 'react'
import { BaniContext, fetcher } from './App'
import { Button, CircularProgress, Input } from '@mui/joy'
import './App.less'
import Bani from './Bani'
import { utils } from './utils'
import { toUnicode } from 'gurmukhi-utils'

type Props = {}

const Shabads = (props: Props) => {

    const [shabads, setShabads] = useState({ verses: [] });
    const [searchInput, setSearchInput] = useState('');
    const { shabadID, setShabadID, setRoute, setSearch, setBaniName, search, statusText, setStatusText} = useContext(BaniContext);
    const { fetchShabads } = utils()

    useEffect(() => {
        return(
            () => {
                setStatusText(null)
            }
        )
    }, [])

    useEffect(() => {setShabadID}, [shabadID])

    const updateShabads = () => {
        setStatusText(<CircularProgress style={{margin: '1rem'}} />)
        fetchShabads(search).then((shabads) => {
            if(shabads.verses.length === 0) setStatusText('No Shabads Found');
            else setStatusText(null)
            setShabads(shabads);
        }).catch(() => setStatusText('Please Try Again'))
    }

    return (
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
                            const baniName = (tuk as string).split(' ').slice(0, 6).join('')
                            return (
                                <>
                                    <h1 onClick={() => {
                                        setShabadID(shabad.shabadId);
                                        setBaniName(baniName);
                                        setRoute(baniName)
                                    }} className='bani'>
                                        {tuk}
                                    </h1>
                                </>
                            )
                        })
                    }
                </>
            }
        </div>
    )
}

export default Shabads