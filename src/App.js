import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

function App() {

  // useEffect(()=>{
  //   fecthApi  ()
  // }, [])  
  
  // console.log('process.env.REACT_APP_API_KEY', process.env.REACT_APP_API_KEY)
  // const fecthApi = async() =>{
  //   const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll`)  
  //   return res.data

  // }

  // const query = useQuery({ queryKey: ['todos'], queryFn: fecthApi })

  // console.log('query', query)

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key = {route.path} path={route.path} element ={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App