import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({size, styleButton, styleTextButton, textbutton, disabled,...rests}) => {
  return (
    <Button 
            style={{
              ...styleButton,
              background : disabled ? '#ccc' : styleButton.background ,
              cursor: disabled ? 'not-allowed' : 'pointer',
              
              
            }}
            size= {size} 
             
            {...rests}
        >
        <span style={styleTextButton}>{textbutton}</span>
    </Button>
  )
}

export default ButtonComponent
