import {  Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { convertPrice } from '../../utils'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'

const StatisticsTable = () => {
  const user = useSelector((state) => state?.user)
  const [totalPriceByProduct, setTotalPriceByProduct] = useState([])

  const getTotalOrderPriceByProduct = async () => {
    const res = await OrderService.getTotalOrderPriceByProduct(user?.access_token)
    setTotalPriceByProduct(res.data)  
  }

  useEffect(() => {
    getTotalOrderPriceByProduct()
  }, [user?.access_token])

  console.log(totalPriceByProduct); 

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }



  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isPending: isPendingOrders, data: orders } = queryOrder

  const STATISTICS_CONFIG = {
    paymentMethod: {
      type: "paymentMethod",
      title: "Phương thức thanh toán",
      mapping: orderContant.payment,
      colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
    },
    isPaid: {
      type: "isPaid",
      title: "Thanh toán",
      mapping: { true: "Đã thanh toán", false: "Chưa thanh toán" },
      colors: ["#4caf50", "#f44336"],
    },
    isDelivered: {
      type: "isDelivered",
      title: "Giao hàng",
      mapping: { true: "Đã giao hàng", false: "Chưa giao hàng" },
      colors: ["#2196f3", "#ff9800"],
    },
  };
  
  const productColumns = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        align: 'center',  
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        align: 'center',   
    },
    {
        title: 'Tổng giá trị',
        dataIndex: 'totalPrice',
        align: 'center',   
        render: (text) => convertPrice(text),
    },
    {
        title: 'Số lượng đã giao',
        dataIndex: 'deliveredQuantity',
        align: 'center',   
    },
    {
        title: 'Số lượng chưa giao',
        dataIndex: 'undeliveredQuantity',
        align: 'center',   
    },
    {
        title: 'Số lượng đã thanh toán',
        dataIndex: 'paidQuantity',
        align: 'center', 
    },
    {
        title: 'Số lượng chưa thanh toán',
        dataIndex: 'unpaidQuantity',
        align: 'center',   
    },
];


  return (
    <div>
      <WrapperHeader>THỐNG KÊ</WrapperHeader>
      <div style={{ 
        borderTop: '1px solid #000', 
        margin: '0px 0', 
        width: '20%' 
        }} />
    <div style={{ 
        display: "flex", 
        gap: "20px", 
        flexWrap: "wrap", 
        justifyContent: "center",  
        alignItems: "center",      
        margin: "0 auto",         
        maxWidth: "1200px"        
        }}>
        {Object.keys(STATISTICS_CONFIG).map((key, index) => (
            <div style={{ display: "flex", alignItems: "center" }} key={key}>

            <div style={{ height: 250, width: 250 }}>
                <h3 style={{ textAlign: "center" }}>{STATISTICS_CONFIG[key].title}</h3>
                <PieChartComponent
                data={orders?.data}
                type={STATISTICS_CONFIG[key].type}
                mapping={STATISTICS_CONFIG[key].mapping}
                colors={STATISTICS_CONFIG[key].colors}
                />
            </div>

            {index !== Object.keys(STATISTICS_CONFIG).length - 1 && (
                <div style={{ 
                height: '200px', 
                borderLeft: '2px solid #D3D3D3', 
                marginLeft: '20px' 
                }}></div>
            )}
            </div>
        ))}
        </div>

      <div style={{ 
        borderTop: '2px solid #000', 
        margin: '20px auto', 
        width: '80%',   
        textAlign: 'center'  
        }} />

      <div style={{ marginTop: '20px' }}>
        <h2 style={{textAlign: "center" }}>Tổng giá trị theo sản phẩm</h2>
        <Table 
          columns={productColumns}
          dataSource={totalPriceByProduct}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default StatisticsTable