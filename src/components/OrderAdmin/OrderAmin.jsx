import { Button, Modal, Space } from 'antd'
import React, { useState } from 'react'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { convertPrice } from '../../utils'
import * as message from '../Message/Message'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant' 
import moment from 'moment'
import { useMutationHooks } from '../../hooks/useMutationHook'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)


  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('HH:mm:ss  DD/MM/YYYY');
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isPending: isPendingOrders, data: orders } = queryOrder

  const markAsDelivered = useMutationHooks(async (id) => {
    await OrderService.markAsDelivered(id, user?.access_token)
  })

  const markAsDelivered2 = useMutationHooks(async (id) => {
    await OrderService.markAsDelivered2(id, user?.access_token)
  })

  const markAsPaid = useMutationHooks(async (id) => {
    await OrderService.markAsPaid(id, user?.access_token)
  })

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const [isModalDeliveredVisible, setIsModalDeliveredVisible] = useState(false);
  const [currentDeliveredOrderId, setCurrentDeliveredOrderId] = useState(null);
  const handleMarkAsDeliveredWithConfirmation = (id) => {
      setCurrentDeliveredOrderId(id);
      setIsModalDeliveredVisible(true);
  };
  
  const handleMarkAsShipped = (id) => {
    setCurrentOrderId(id);
    setIsModalVisible(true);
  };
  const handleOk = () => {
    if (currentOrderId) {
      console.log("currentOrderId",)
      markAsDelivered.mutate(currentOrderId, {
        onSuccess: () => {
          console.log("handleOk")
          queryOrder.refetch();
          message.success('Đã chuyển sang trạng thái "Đang vận chuyển" thành công');
        },
        onError: () => {
          message.error('Failed to mark as delivered');
        }
      });
    }
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeliveredOk = () => {
    if (currentDeliveredOrderId) {
      markAsDelivered2.mutate(currentDeliveredOrderId, {
        onSuccess: () => {
          queryOrder.refetch();
          message.success('Đã chuyển sang trạng thái "Đã giao" thành công');
        },
        onError: () => {
          message.error('Failed to mark as delivered');
        }
      });
    }
    setIsModalDeliveredVisible(false);
  };
  
  const handleDeliveredCancel = () => {
    setIsModalDeliveredVisible(false);
  };
  


  const handleMarkAsPaid = (id) => {
    markAsPaid.mutate(id, {
      onSuccess: () => {
        queryOrder.refetch()
        console.log("handleMarkAsPaid")
        message.success('Đã chuyển sang trạng thái đã thanh toán thành công')
      },
      onError: () => {
        message.error('Failed to mark as paid')
      }
    })
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            onClick={confirm}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{ width: 90 }}
            onClick={() => clearFilters && clearFilters()}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });
  

  const columns = [
    {
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName'),
      align: 'center',   
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone'),
      align: 'center',   
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address'),
      align: 'center',   
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (text) => formatDate(text),
      ...getColumnSearchProps('createdAt'),
      align: 'center',   
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      align: 'center',   
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      render: (text) => (
        <span style={{ color: text === 'Đã thanh toán' ? 'blue' : 'gray' }}>
          {text}
        </span>
      ),
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Shipped',
      dataIndex: 'isDelivered',
      align: 'center',   
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      render: (text) => {
        switch (text) {
          case 'Chuẩn bị hàng':
            return <span style={{ color: 'gray' }}>{text}</span>;
          case 'Đang vận chuyển':
            return <span style={{ color: '#ffbf00' }}>{text}</span>;
          case 'Đã giao':
            return <span style={{ color: '#00d400' }}>{text}</span>;
          default:
            return <span>{text}</span>;
        }
      },
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      align: 'center',   
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (text) => convertPrice(text),

      ...getColumnSearchProps('totalPrice'),
      align: 'center',   
    },
    {
      title: 'Actions',
      align: 'center',
      dataIndex: 'actions',
      render: (text, record) => (
        
        <Space size="middle">
          {record.isDelivered !== 'Đang vận chuyển' && record.isDelivered !== 'Đã giao' && (
            <Button
              style={{ background: 'orange', color: 'white' }}
              onClick={() => handleMarkAsShipped(record._id)}
              disabled={record.isDelivered === 'Đang vận chuyển' || record.isDelivered === 'Đã giao'}
            >
              Mark as Shipped
            </Button>
          )}
          {(record.isDelivered === 'Đang vận chuyển' || record.isDelivered === 'Đã giao') && (
            <Button
              style={{ background: 'green', color: 'white' }}
              onClick={() => handleMarkAsDeliveredWithConfirmation(record._id)} 
              disabled={record.isDelivered === 'Đã giao'}
            >
              Delivered
            </Button>
          )}
          <Button
            style={{ background: 'blue', color: 'white' }}
            onClick={() => handleMarkAsPaid(record._id)}
            disabled={record.isPaid === 'Đã thanh toán'}
          >
            Paid
          </Button>
        </Space>
      ),
    }
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { 
      ...order, 
      key: order._id, 
      userName: order?.shippingAddress?.fullName, 
      phone: order?.shippingAddress?.phone, 
      address: order?.shippingAddress?.address, 
      paymentMethod: orderContant.payment[order?.paymentMethod],
      isPaid: order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
      isDelivered: order?.isDelivered || 'Chuẩn bị hàng', // Sử dụng giá trị thực tế của isDelivered
      totalPrice: order?.totalPrice
    }
  })

  

  return (
    <div>
      <WrapperHeader>QUẢN LÝ ĐƠN HÀNG</WrapperHeader>
      <div style={{ 
        borderTop: '1px solid #000', 
        margin: '0px 0', 
        width: '20%' 
        }} />
      <div style={{ marginTop: '20px' }}>
        <TableComponent  columns={columns} isPending={isPendingOrders} data={dataTable} />
      </div>
      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Bạn có chắc chắn muốn đánh dấu đơn hàng này là "Đang vận chuyển"?</p>
      </Modal>

      <Modal
        title="Xác nhận"
        visible={isModalDeliveredVisible}
        onOk={handleDeliveredOk}
        onCancel={handleDeliveredCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Bạn có chắc chắn muốn đánh dấu đơn hàng này là "Đã giao"?</p>
      </Modal>

    </div>
  )
}

export default OrderAdmin