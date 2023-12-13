import { MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { NavigateFunction } from 'react-router-dom';
import { todoMap } from './utils';

type Props = {navigate?: NavigateFunction}

const Todo = ({navigate}: Props) => {
  const [todo, setTodo] = useState(' ');
  const handleChange = (e) => {
    const selectedValue = e.target.value as string;
    setTodo(selectedValue);
    if(navigate) navigate(selectedValue)
    else location.pathname = selectedValue
  }

  const uniqueTodo = {...todoMap};
  delete uniqueTodo[window.location.pathname]  
  return (
        <>
          <Select className='todoSelect'
            value={todo}
            onChange={handleChange}>
            <MenuItem disabled value=" ">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਿਹ
            </MenuItem>
            {
              Object.entries(uniqueTodo).map(([path, heading]) => 
                <MenuItem className='tuk navigation' value={path}>
                  {heading}
                </MenuItem>
              )
            }
          </Select>
          </>
  )
}

export default Todo