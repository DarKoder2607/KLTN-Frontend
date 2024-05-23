import React, { useState } from 'react';
import * as UserService from '../../services/UserService';
import { success, error } from '../../components/Message/Message';
import InputForm from '../../components/InputForm/InputForm';
import { Image } from 'antd';
import imagelogo from '../../assets/images/Shipper_CPS3.webp'
import { useNavigate } from 'react-router-dom'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style';
// import Loading from '../../components/LoadingComponent/Loading';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { HomeOutlined } from '@ant-design/icons';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate()

    const handleNavigateHome = () => {
      navigate('/')
    }

    const handleNavigateSignIn = () =>{
        navigate('/sign-in')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };

    const handleForgotPassword = async () => {
        try {
            const response = await UserService.forgotPassword({ email });
            if (response.status === 'OK') {
                success('Vui lòng kiểm tra email để đặt lại mật khẩu mới.');
            } else {
                error(response.message);
            }
        } catch (err) {
            error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
          <div style={{width: '800px', height:'445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
            <WrapperContainerLeft>
            <h1 style={{color: 'red'}}>WELCOME TO DH PHONESTORE !</h1>
              <p style={{fontSize: "15px",display: 'flex',justifyContent : 'center', 
                      alignItems: 'center', fontWeight : 'bold'}}>Quên mật khẩu </p>
              <InputForm  style={{marginBottom: '10px'}} placeholder="Nhập email của bạn" value={email} 
                                                            onChange={handleOnchangeEmail} />
             
            <ButtonComponent
                disabled = {!email.length }
                onClick ={handleForgotPassword}
                size={20} 
                // variant = "borderless"
                styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
                textbutton={'Gửi Email'}
                styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                    > 
            </ButtonComponent>
              
              <p><WrapperTextLight onClick={handleNavigateSignIn}>Quay lại Đăng Nhập</WrapperTextLight></p>
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
              <Image  src={imagelogo} preview = {false} alt='image-logo' height="203px" width="203px" />
              <h4>Mua sắm tại HDStore</h4>
            </WrapperContainerRight>
          </div>
        </div>
      )
};

export default ForgotPasswordPage;