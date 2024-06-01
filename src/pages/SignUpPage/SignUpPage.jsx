import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imagelogo from '../../assets/images/logo.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled, HomeOutlined } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [isShowPassword, setIsShowPasswword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPasswword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleOnchangeEmail = (value) =>{
    setEmail (value)
  }
  const handleOnchangePassword = (value) =>{
    setPassword (value)
  }
  const handleOnchangeConfirmPassword = (value) =>{
    setConfirmPassword (value)
  }
  const handleOnchangeName = (value) =>{
    setName (value)
  }
  const handleOnchangePhone = (value) =>{
    setPhone (value)
  }


  const mutation = useMutationHooks(
    data => UserService.signupUser(data)   
  )

  const {data, isPending, isSuccess, isError} = mutation

  useEffect(() =>{
    if(isSuccess && data?.status !== 'ERR'){
      message.successSignup()
      handleNavigateSignIn()
    }else if(isError){
      message.error()
    }
  })
  
  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleNavigateSignIn = () =>{
      navigate('/sign-in')
  }
  const handleSignUp = () =>{
    mutation.mutate({
      name,
      email, 
      password, 
      confirmPassword,
      phone
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
      <div style={{width: '800px', height:'500px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
        
        <WrapperContainerLeft>
          <h1 style={{color: 'red'}}>WELCOME TO DH PHONESTORE !</h1>
          <p style={{fontSize: "15px",display: 'flex',justifyContent : 'center', 
                  alignItems: 'center', fontWeight : 'bold'}}>REGISTER</p>
          <InputForm  style={{marginBottom: '10px'}} placeholder="Nhập vào Họ và tên..." value={name} onChange={handleOnchangeName} />
          <InputForm  style={{marginBottom: '10px'}} placeholder="Nhập vào Số điện thoại..." value={phone} onChange={handleOnchangePhone} />
          <InputForm  style={{marginBottom: '10px'}} placeholder="Nhập vào email..." value={email} onChange={handleOnchangeEmail} />
          
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
            <InputForm placeholder = "Nhập vào Password..." style ={{marginBottom: ' 10px'}} type={isShowPassword ? "text": "password"} value={password} onChange={handleOnchangePassword}/>
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
            <InputForm placeholder = "Nhập xác nhận lại Password..." type = {isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
          {data?.status === 'ERR' && <span style={{color : 'red'}}>{data?.message}</span>}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled = {!name.length|| !phone.length||!email.length || !password.length || !confirmPassword.length}
              onClick= {handleSignUp}
              size={20} 
              // variant = "borderless"
              styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
              textbutton={'Đăng ký'}
              styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                    > 
            </ButtonComponent>
          </Loading>
          <p style={{fontSize: '15px'}}>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <HomeOutlined 
            onClick={handleNavigateHome}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'rgb(13, 92, 182)',
            }}> 
           </HomeOutlined>
          <Image  src={imagelogo} preview = {false} alt='image-logo' height="300px" width="300px" />
          <h2>Mua sắm tại DH Phonestore</h2>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage
