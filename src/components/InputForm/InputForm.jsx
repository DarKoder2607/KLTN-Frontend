import React from 'react'
import { WrapperInputStyle } from './Style'

const InputForm = (props) => {
  const {placeholder = 'Nhập text', ...rests} = props
  const handleOnchangeInput = (e) =>{
    props.onChange(e.target.value)
  }
  return (
    <WrapperInputStyle placeholder={placeholder} valueinput = {props.value} {...rests} onChange={handleOnchangeInput}/>
  )
}

export default InputForm
