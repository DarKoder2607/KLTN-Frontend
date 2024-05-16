import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const {
        size , placeholder, textbutton,
        bordered, backgroundColorInput = '#fff', 
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = '#fff'
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
        <ButtonComponent 
            size= {size} 
            // variant = "borderless"
            styleButton={{background: backgroundColorButton, border: !bordered && 'none', borderRadius: 0}} 
            icon={<SearchOutlined style={{color: colorButton}}/>}
            textbutton={textbutton}
            styleTextButton={{color: colorButton}}
        />
    </div>
  )
}

export default ButtonInputSearch
