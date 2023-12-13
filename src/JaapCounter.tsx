import React, { useEffect, useState } from 'react'
import './App.less'
import { Box, Button, Input, Modal, Typography } from '@mui/material';
import InputGroup from './InputGroup';

type Props = {}

const JaapCounter = (props: Props) => {
    const [count, setCount] = useState(0);
    const [milestone, setMilestone] = useState(108)
    const [modalType, setModalType] = React.useState(false);
    useEffect(() => {
        if(!count) setCount(0)
        if(count === milestone || count % milestone === 0) {
        const canVibrate = window.navigator.vibrate
        if (canVibrate) window.navigator.vibrate(200)
        }    
    }, [count])

    return (
    <div className='App'>
        <div onClick={() => {
            if(!modalType) setCount(count+1)
        }} className="jaapCounter Bani">
            <h1>{count} / {milestone}</h1>
            <div className="buttonGroup">
                <button onClick={() => setModalType('resetCount')}>Reset</button>
                <button onClick={() => setModalType('milestone')}>Set Milestone</button>
            </div>
            {modalType === 'resetCount' && <InputGroup 
                ButtonText={'Set Reset Count'}
                close={setModalType}
                modalType={modalType}
                onSubmit={() => {}}
                placeholder={'Reset Count'}
                setMilestone={setMilestone}
                setCount={setCount}
            />}
            {modalType === 'milestone' && <InputGroup 
                ButtonText={'Set Milestone'}
                close={() => setModalType()}
                onSubmit={() => {}}
                placeholder={'Set Milestone'}
                modalType = {modalType}
                setMilestone = {setMilestone}
                setCount = {setCount}
            />}
        </div>
    </div>
    )
}

export default JaapCounter