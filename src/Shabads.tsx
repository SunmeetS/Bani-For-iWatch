import React, { useContext, useEffect, useState } from 'react'
import { BaniContext, fetcher } from './App'
import { Button, Input } from '@mui/joy'
import './App.less'
import Bani from './Bani'
import { handleSubmit, utils } from './utils'
import { toUnicode } from 'gurmukhi-utils'

type Props = {}

const Shabads = (props: Props) => {

    const [shabads, setShabads] = useState({ verses: [] });
    const [searchInput, setSearchInput] = useState('');
    const { shabadID, setShabadID, setRoute, setSearch } = useContext(BaniContext);
    const { fetchShabads } = utils()

    useEffect(() => {setShabadID}, [shabadID])

    const updateShabads = () => {
        fetchShabads(searchInput).then((shabads) => setShabads(shabads))
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
                        shabads?.verses?.map((shabad) => {
                            const tuk = shabad.verse.unicode

                            return (
                                <>
                                    <h1 onClick={() => {
                                        setShabadID(shabad.shabadId);
                                        setRoute('Read a Shabad')
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