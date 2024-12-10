
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'


const ButtonInputSearch = (props) => {
    const {
        size , placeholder,
        bordered, backgroundColorInput = '#fff', 
      
    }= props
  return (
    <div style={{display: 'flex', borderRadius: 0}} >
        <InputComponent
            size= {size}
            //variant="borderless"
            bordered = {bordered} 
            placeholder={placeholder} 
            style={{backgroundColor: backgroundColorInput}}
            {...props}
        />
    </div>
  )
}

export default ButtonInputSearch
