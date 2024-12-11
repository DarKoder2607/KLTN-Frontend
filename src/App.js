import React, { Fragment, useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import { jwtDecode} from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'
import Chatbot from './components/Chatbot/Chatbot'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'


function App() {
  
  const dispatch = useDispatch(); 
  const [isPending, setIsPending] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsPending(true)
    const {storageData, decoded} = handleDecoded()
    if(decoded?.id){
      handleGetDetailsUser(decoded?.id, storageData)
    }  
     setIsPending(false)
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return {decoded, storageData}
     
  }

  UserService.axiosJWT.interceptors.request.use(async (config) =>{
    const currentTime = new Date()
    const { decoded} = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000){
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config
  }, (err) =>{
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      if (res && res.data) {
        dispatch(updateUser({ ...res.data, access_token: token }));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
    
    
  }

  const ShowChatbot = () => {
    const location = useLocation();
    return location.pathname === '/' ? <Chatbot /> : null;
  };

  return (
    <div>
      <Loading isPending={isPending}>
        <Router>
          <ScrollToTop/>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const ischeckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key = {route.path} path={ischeckAuth ? route.path : undefined} element ={
                  <Layout>
                    <Page/>
                  </Layout>
                }/>
              )
            })}
          </Routes>
          <ShowChatbot/>
        </Router>
      </Loading>
    </div>
  )
}

export default App