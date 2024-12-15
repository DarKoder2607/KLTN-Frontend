import { Button, Form, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, LockOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons'
import axios from 'axios';

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isPendingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = UserService.deleteManyUser(
        ids,
        token)
      return res
    },
  )

  const handleDelteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryClient.invalidateQueries(['users'])
      }
    })
  }

  const handleLockUser = (id) => {
    setIsLoadingUpdate(true);
    UserService.lockUserAccount(id, user?.access_token)
      .then((response) => {
        message.success('Đã khóa tài khoản User thành công');
        queryClient.invalidateQueries(['users']);   
      })
      .catch((error) => {
        message.error('Error locking user account');
      })
      .finally(() => {
        setIsLoadingUpdate(false);
      });
  };
  
  const handleUnlockUser = (id) => {
    setIsLoadingUpdate(true);
    UserService.unlockUserAccount(id, user?.access_token)
      .then((response) => {
        message.success('Tài khoản User đã được mở khóa thành công');
        queryClient.invalidateQueries(['users']); 
      })
      .catch((error) => {
        message.error('Error unlocking user account');
      })
      .finally(() => {
        setIsLoadingUpdate(false);
      });
  };
  

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = UserService.deleteUser(
        id,
        token)
      return res
    },
  )

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryClient = useQueryClient()
  const users = queryClient.getQueryData(['users'])
  const isFetchingUser = useIsFetching(['users'])
  const renderAction = (record) => {
    console.log('record',record);
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
        {record?.isLocked ? (
          <LockOutlined style={{ color: 'blue', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleUnlockUser(record._id)} />
        ) : (
          <UnlockOutlined style={{ color: 'green', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleLockUser(record._id)} />
        )}
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        }
      ],
      onFilter: (value, record) => record.isAdmin === value,
      render: (isAdmin) => isAdmin ? 'TRUE' : 'FALSE'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => renderAction(record),
    },
  ];
  const dataTable = users?.data?.length > 0 && users?.data?.map((user) => {
    return { ...user, key: user._id, _id: user._id }
  })
  console.log(dataTable);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success('Success')
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success('Success')
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    setIsEmailValid(true);
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Success')
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryClient.invalidateQueries(['users'])
      }
    })
  }

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      const isCheckEmail = reg.test(value)
      setIsEmailValid(isCheckEmail);
      if (!isCheckEmail) {
        message.error('Định dạng email không chính xác')
      }
    }
    setStateUserDetails({
      ...stateUserDetails,
      [name]: value
    })
  }

  // const handleOnchangeAvatarDetails = async ({ fileList }) => {
  //   const file = fileList[0]
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStateUserDetails({
  //     ...stateUserDetails,
  //     avatar: file.preview
  //   })
  // }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gwbmydmw');   
    formData.append('cloud_name', 'dleio5sat');  
  
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dleio5sat/image/upload', 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      return response.data.secure_url;  
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      throw error;
    }
  };

  

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    
    if (file.originFileObj) {
      try {
        
        const imageUrl = await uploadToCloudinary(file.originFileObj);
        setStateUserDetails({
          ...stateUserDetails,
          avatar: imageUrl  
        });
      } catch (error) {
        console.error("Failed to upload avatar image", error);
      }
    }
  };
  

  const onUpdateUser = () => {
    if (isEmailValid) {
      mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
        onSettled: () => {
          queryClient.invalidateQueries(['users'])
        }
      })
    } else {
      message.error('Email không hợp lệ, vui lòng kiểm tra lại.');
    }
  }

  return (
    <div>
      <WrapperHeader>QUẢN LÝ NGƯỜI DÙNG</WrapperHeader>
      <div style={{ 
        borderTop: '1px solid #000', 
        margin: '0px 0', 
        width: '20%' 
        }} />
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDelteMany={handleDelteManyUsers} columns={columns} isPending={isFetchingUser} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              console.log('Selected record:', record);
              if (record._id) {
                setRowSelected(record._id); }
            }
          };
        }} />
      </div>
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isPending={isPendingUpdate || isPendingUpdated}>

          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button >Select File</Button>
                {stateUserDetails?.avatar && (
                  <img src={stateUserDetails?.avatar} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={!isEmailValid}>
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminUser
