import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'
import useHover from '../../hooks/useHover'

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()

  return (
    <div style={{ padding:'0 120px', background: '#efefef'}}>
      <div style={{fontSize : '15px' }}><span 
        style={{
          cursor: 'pointer', 
          color: isHovered ? '#ea8500' : '#000' 
          }} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
         
        onClick={() => navigate('/')}>Trang chủ</span> <span> \</span>
        <span style={{fontWeight: 'bold', color: 'blue'}}> Chi tiết sản phẩm </span>
        </div>
      
        <ProductDetailsComponent idProduct ={id}/>
    
    </div>
  )
}

export default ProductDetailsPage
