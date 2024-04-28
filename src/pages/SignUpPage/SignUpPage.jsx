import React, { useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/Shipper_CPS3.webp'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
const SignUpPage = () => {
  const [isShowPassword, setIsShowPasswword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPasswword] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
      <div style={{width: '800px', height:'445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm  style={{marginBottom: '10px'}} placeholder="abc@gmail.com"/>
          <div style={{position:'relative'}}>
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
              isShowConfirmPassword ? (
                <EyeFilled/>
              ) : (
                <EyeInvisibleFilled/>
              )
            }
            </span>
            <InputForm placeholder = "password" style ={{marginBottom: ' 10px'}} type={isShowPassword ? "text": "password"}/>
          </div>
          <div style={{position:'relative'}}>
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
              isShowPassword ? (
                <EyeFilled/>
              ) : (
                <EyeInvisibleFilled/>
              )
            }
            </span>
            <InputForm placeholder = "password" type = {isShowPassword ? "text" : "password"}/>
          </div>
          <ButtonComponent
            bordered={false}
            size={20} 
            // variant = "borderless"
            styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
            textButton={'Đăng Nhập'}
            styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                  > 
          </ButtonComponent>
          
          <p>Bạn đã có tài khoản? <WrapperTextLight > Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image  src={imagelogo} preview = {false} alt='image-logo' height="203px" width="203px" />
          <h4>Mua sắm tại HDStore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage
