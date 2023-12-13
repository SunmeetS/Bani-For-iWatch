import { MenuItem, Select } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { todoMap } from './utils';

type Props = {}

const Todo = (props: Props) => {
  const [todo, setTodo] = useState(' ');
  const navigate = useNavigate()
  const handleChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = e.target.value as string;
    setTodo(selectedValue);
    navigate(selectedValue);
  }, [navigate]);
  return (
        <>
          <Select className='tuk navigation'
            value={todo}
            onChange={handleChange}>
            <MenuItem disabled value=" ">
            ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਿਹ
            </MenuItem>
            {
              Object.entries(todoMap).map(([heading, path]) => 
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