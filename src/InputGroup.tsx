import { Box, Button, Input, Modal, styled } from '@mui/material'
import React, { useState } from 'react'

const InputGroup = ({
    ButtonText, close, placeholder, onSubmit, setCount, modalType, setMilestone, ...restProps
}) => {
    const [val, setVal] = useState('')
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(20vw, 20rem, 40vw)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        zIndex:20
      };
  return (
    <div>
        <Modal
            onClose={close}
            open
            >
            <Box sx={style}>
                <Input type='number' onInput={(e) => setVal((e.target as HTMLInputElement).value)} placeholder={placeholder}/>
                <Button onClick={() => {
                    onSubmit();
                    if(modalType === 'milestone') setMilestone(val);
                    if(modalType === 'resetCount') {
                        setCount(parseInt(val))
                    }
                    close()
                }}>{ButtonText}</Button>
            </Box>
        </Modal>
    </div>
  )
}

export default InputGroup