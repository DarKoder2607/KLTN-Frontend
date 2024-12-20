import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imagelogo from '../../assets/images/logo.png'
import { EyeFilled, EyeInvisibleFilled, HomeOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import {useDispatch} from  'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import { GoogleLogin } from '@react-oauth/google'

const SignInPage = () => {
  const [isShowPassword, setIsShowPasswword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation()

  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)   
  )

  const mutation_google = useMutationHooks(
    data => UserService.loginGoogleUser(data)   
  )

  const {data, isPending, isSuccess} = mutation
  console.log('mutation', mutation)

  useEffect(() =>{
    if (isSuccess && data?.status !== 'ERR'){
      if(location?.state){
        navigate(location.state)
      } else{
        const decoded = jwtDecode(data?.access_token);
      if (decoded?.isAdmin) {
        navigate('/system/admin');  // Redirect to Admin page if isAdmin is true
      } else {
        navigate('/');  // Redirect to Homepage if not admin
      }
      message.success('Đăng nhập thành công!');
    }
      
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token)
        console.log('decode', decoded)
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }else if (data?.status === 'ERR') {
      // Hiển thị thông báo lỗi nếu tài khoản bị khóa
      if (data.message === 'This account is locked') {
          message.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với với nhân viên để được hỗ trợ');
      } else {
          message.error(data.message);
      }
    }
  }, [isSuccess, data, location, navigate])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
 
  }

  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleNavigateForgotPasswword= () =>{
    navigate('/forgot-password')
  }

  const handleNavigateSignup = () =>{
    navigate('/sign-up')
  }
  const handleOnchangeEmail = (value) =>{
    setEmail (value)
  }
  const handleOnchangePassword = (value) =>{
    setPassword (value)
  }
  const handleSignIn = () =>{
    mutation.mutate({
      email, 
      password
    })
  }

  const onGoogleLogin = async (response) => {
    if (!response.credential) {
        console.error("No credential received from Google.");
        return;
    }

    const decodedGoogle = jwtDecode(response.credential);
    console.log("decoded:  ", decodedGoogle);

    mutation_google.mutate(
      {
          name: decodedGoogle.name,
          email: decodedGoogle.email,
          picture: decodedGoogle.picture,
      },
      {
          onSuccess: async (data) => {
              console.log("Google Login Response:", data);

                if (data?.status === 'ERR' && data.message === 'This account is locked') {
                  message.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với nhân viên để được hỗ trợ');
                  return;  
              }

              if (data?.access_token) {
                  localStorage.setItem("access_token", JSON.stringify(data.access_token));

                  const decoded = jwtDecode(data.access_token);

                  if (decoded?.id) {
                      await handleGetDetailsUser(decoded.id, data.access_token);
                      navigate("/");
                      message.success("Đăng nhập thành công!");
                  }
              }
          },
          onError: (error) => {
              console.error("Google Login Error:", error);
              message.error('Đăng nhập thất bại. Vui lòng thử lại!');

          },
      }
    );
  };


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
      <div style={{width: '800px', height:'445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
        <h1 style={{color: 'red'}}>WELCOME TO DH PHONESTORE !</h1>
          <p style={{fontSize: "15px",display: 'flex',justifyContent : 'center', 
                  alignItems: 'center', fontWeight : 'bold'}}>SIGN IN </p>
          <InputForm  style={{marginBottom: '10px'}} placeholder="Nhập vào email..." value={email} onChange={handleOnchangeEmail}/>
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
            <InputForm placeholder = "Nhập vào Password..." type = {isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword}/>
          </div>
          {data?.status === 'ERR' && <span style={{color : 'red'}}>{data?.message}</span>}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled = {!email.length || !password.length }
              onClick ={handleSignIn}
              size={20} 
              // variant = "borderless"
              styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
              textbutton={'Đăng Nhập'}
              styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                    > 
            </ButtonComponent>
          </Loading>
          <p><WrapperTextLight onClick={handleNavigateForgotPasswword}>Quên mật khẩu?</WrapperTextLight></p>
          <p style={{fontSize: '15px'}}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignup}> Tạo tài khoản</WrapperTextLight></p>
        
          <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
              <GoogleLogin  size="large"  
                            onSuccess={onGoogleLogin} onError={()=> {console.log("Login google error")}}/>
          </div>

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

export default SignInPage
