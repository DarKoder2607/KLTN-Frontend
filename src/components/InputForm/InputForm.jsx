import React, { useState } from 'react'
import { WrapperInputStyle } from './Style'

const InputForm = (props) => {
    const [valueInput, setValueInput] = useState('')
    const {placeholder = 'Nhập text', ...rests} = props
  return (
    <WrapperInputStyle placeholder={placeholder} valueInput = {valueInput} {...rests}/>
  )
}

export default InputForm
