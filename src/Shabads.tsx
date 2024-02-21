import React, { useContext, useEffect, useState } from 'react'
import { BaniContext } from './main'
import { Button, CircularProgress, Input } from '@mui/joy'
import './App.less'
import { debounce, utils } from './utils'
import { toEnglish, toUnicode } from 'gurmukhi-utils'
import { useNavigate } from 'react-router-dom'
import { getFromLS } from './App'

type Props = {}

const Shabads = (props: Props) => {

    const [shabads, setShabads] = useState({ verses: [] });
    const [searchInput, setSearchInput] = useState('');
    const { shabadID, setShabadID, setHeading, setSearch, setBaniName, search, statusText,
        setStatusText, isEnglish, showFavourites, setShowFavourites, shabadTuk, setShabadTuk,
        setLogo, showHistory
    } = useContext(BaniContext);
    const { fetchShabads, fetchMultiple } = utils()
    const navigate = useNavigate()
    const favourites = getFromLS('favourites')

    useEffect(() => {
        setHeading?.('Search Shabads');
        setLogo({ history: 'HISTORY', favourites: '💙' })
        return (
            () => {
                setStatusText(null)
                setLogo()
            }
        )
    }, [])

    useEffect(() => {
        debounce(updateShabads, 100)()
    }, [search])

    useEffect(() => { setShabadID }, [shabadID])

    const updateShabads = () => {
        if (search.length < 3) return;
        setStatusText?.(<CircularProgress style={{ margin: '1rem' }} />)
        fetchShabads(search).then((shabads) => {
            if (shabads.verses.length === 0) setStatusText('No Shabads Found');
            else setStatusText(null)
            setShabads?.(shabads);

            fetchMultiple(shabads.verses, 'Search Shabads Fetched Succesfully')

        }).catch(() => setStatusText('Please Try Again'));
    }

    let history = getFromLS('history') ?? [];

    if (showFavourites || showHistory) return (
        <div className="App">
            <div className='shabad-main Banis'>
                <h1 style={{ textDecoration: 'underline', marginBottom: '1rem' }} className='gurmukhiMeanings'>{
                    showFavourites ? 'Favourites' : 'History'
                }</h1>
                {
                    (showFavourites ? favourites : history)?.map((shabad, index) => {
                        return shabad.shabadTuk && <h1 className='bani searchTuk favourites' onClick={
                            () => {
                                setShabadID(shabad.shabadId);
                                setBaniName(shabad.shabadTuk);
                                setHeading?.(shabad.shabadTuk.split(' ').slice(0, 6).join(''));
                                setShabadTuk(shabad.shabadTuk)
                                navigate('/bani');
                            }
                        }>
                            {`${index + 1} - ${shabad.shabadTuk}`}
                        </h1>
                    })
                }
            </div>
        </div>
    )

    return (
        <div className="App">
            <div className='shabad-main Banis'>
                {
                    !shabadID && <>
                        <div className="inputGroup">
                            <Input autoFocus value={searchInput} onChange={(e) => {
                                const inputText = e.target.value;
                                const gurmukhiText = toUnicode(inputText);
                                setSearchInput?.(gurmukhiText);
                                setSearch?.(gurmukhiText)
                            }}
                                placeholder='ਗ ਮ ਸ ਸ ਹ ਨ' />
                        </div>
                        {
                            statusText && <h1>{statusText}</h1>}
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
                                        setShabadTuk(tuk)
                                        navigate('/bani')
                                    }} className='bani searchTuk'>
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