import React, { useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/Shipper_CPS3.webp'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
const SignUpPage = () => {
  const navigate = useNavigate()
  const [isShowPassword, setIsShowPasswword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPasswword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleOnchangeEmail = (value) =>{
    setEmail (value)
  }
  const handleOnchangePassword = (value) =>{
    setPassword (value)
  }
  const handleOnchangeConfirmPassword = (value) =>{
    setConfirmPassword (value)
  }

  const handleNavigateSignIn = () =>{
      navigate('/sign-in')
  }
  const handleSignUp = () =>{
    console.log('su', email, password, confirmPassword)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
      <div style={{width: '800px', height:'445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm  style={{marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{position:'relative'}}>
            <span
              onClick={() => setIsShowPasswword(!isShowPassword)}
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
            <InputForm placeholder = "password" style ={{marginBottom: ' 10px'}} type={isShowPassword ? "text": "password"} value={password} onChange={handleOnchangePassword}/>
          </div>
          <div style={{position:'relative'}}>
            <span 
              onClick={() => setIsShowConfirmPasswword(!isShowConfirmPassword)}
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
            <InputForm placeholder = "password" type = {isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
          <ButtonComponent
            disabled = {!email.length || !password.length || !confirmPassword.length}
            onClick= {handleSignUp}
            
            size={20} 
            // variant = "borderless"
            styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
            textButton={'Đăng ký'}
            styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                  > 
          </ButtonComponent>
          
          <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
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
