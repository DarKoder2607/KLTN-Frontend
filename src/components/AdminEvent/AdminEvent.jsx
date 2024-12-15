import { Button, Form, Select, DatePicker, message, Table, Space, Checkbox } from "antd";
import { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import InputComponent from "../InputComponent/InputComponent";
import { useQuery } from "@tanstack/react-query";
import * as EventService from '../../services/EventService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { getAllBrands } from '../../services/ProductService';
import moment from "moment";
import { GlobalStyle } from './style';
import Countdown from 'react-countdown';

const AdminEvent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isPendingUpdate, setisPendingUpdate] = useState(false)
  const user = useSelector((state) => state?.user) 
  const searchInput = useRef(null);
  const inittial = () => ({
    name: '',
    discountType: '',
    discountValue: '',
    startDate: '',
    endDate: '',
    applyType: '',
    appliedCriteria: '',
    status: true
  })

  const [stateEvent, setStateEvent] = useState(inittial())
  const [stateEventDetails, setStateEventDetails] = useState(inittial())
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            if (response.status === 'OK') {
                setBrands(response.data); // Cập nhật danh sách thương hiệu
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    fetchBrands();
  }, []);

  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
      const { 
        name,
        discountType,
        discountValue,
        startDate,
        endDate,
        applyType,
        appliedCriteria } = data
      const res = EventService.createEvent({
        name,
        discountType,
        discountValue,
        startDate,
        endDate,
        applyType,
        appliedCriteria
      })
      return res
    }
  )

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = EventService.updateEvent(id, token, { ...rests });
      console.log('res', res)
      return res;
    }
  );

  const getAllEvents = async () => {
    const res = await EventService.getAllEvents()
    return res
  }
 
  const fetchGetDetailsEvent = async (rowSelected) => {
    const res = await EventService.getDetailsEvent(rowSelected)
    if (res?.data) {
      setStateEventDetails({
        name: res?.data?.name,
        discountType: res?.data?.discountType,
        discountValue: res?.data?.discountValue,
        startDate: res?.data?.startDate,
        endDate: res?.data?.endDate,
        applyType: res?.data?.applyType,
        appliedCriteria: res?.data?.appliedCriteria,
        status: res?.data?.status
      })
    }
    setisPendingUpdate(false)
  }

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue({
        ...stateEventDetails,
        startDate: stateEventDetails.startDate ? moment(stateEventDetails.startDate) : null,
        endDate: stateEventDetails.endDate ? moment(stateEventDetails.endDate) : null,
      });
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateEventDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setisPendingUpdate(true)
      fetchGetDetailsEvent(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsEvent = (id) => {
    const eventDetails = EventService.getDetailsEvent(id); 
    console.log("id: ", id); 
  setStateEventDetails({
    ...eventDetails,
    applyType: eventDetails.applyType,  
    appliedCriteria: eventDetails.appliedCriteria ,  
  });
    setIsOpenDrawer(true)
  }
  useEffect(() => {
    if (isOpenDrawer && stateEventDetails.applyType === 'brand') { 
      form.setFieldsValue({
        appliedCriteria: stateEventDetails.appliedCriteria,
      });
    }
  }, [isOpenDrawer, stateEventDetails, form]);
  


 

  
  
  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = EventService.deleteEvent(
        id,
        token)
      return res
    },
  )
  


  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
  const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

  const queryEvent = useQuery({ queryKey: ['events'], queryFn: getAllEvents })
  const { isPending: isPendingEvents , data: events } = queryEvent

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])
  
  
  const handleDeleteEvent = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryEvent.refetch()
      }
    })
  }
  
 
  const renderAction = (eventId) => {
    return (
      <div>
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleDetailsEvent(eventId)} />
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)}/>
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
 
  };
  const handleReset = (clearFilters) => {
    clearFilters();
   
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

  });

  const CountdownTimer = ({ startDate, endDate }) => {
    const [countdownStarted, setCountdownStarted] = useState(false);
    const currentTime = Date.now();
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
  
    // Kiểm tra khi thời gian hiện tại >= startDate
    useEffect(() => {
      if (currentTime >= startTime) {
        setCountdownStarted(true);
      }
    }, [currentTime, startTime]);
  
    // Nếu chưa đến startDate, hiển thị "Đang chờ bắt đầu..."
    if (currentTime < startTime) {
      return <span>Đang chờ bắt đầu...</span>;
    }
  
    // Nếu đã vượt qua endDate, hiển thị "Sự kiện đã kết thúc"
    if (currentTime > endTime) {
      return <span>Sự kiện đã kết thúc</span>;
    }
  
    // Renderer tùy chỉnh cho countdown
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        return <span>Sự kiện đã kết thúc</span>;
      }
      return (
        <span>
          {days} d {hours} h {minutes} m {seconds} s
        </span>
      );
    };
  
    // Chạy countdown nếu startDate đã tới
    return countdownStarted ? <Countdown date={endTime} renderer={renderer} /> : null;
  };
  

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'),
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
     
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Countdown",
      dataIndex: "countdown",
      render: (countdown, record) => {
        // Sử dụng CountdownTimer để hiển thị countdown
        return <CountdownTimer startDate={record.startDate} endDate={record.endDate} />;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Checkbox
          checked={status}
          disabled
          style={{
            transform: 'scale(1.5)',
          }}
        />
      ),
      
    },
    {
      title: 'Action',
      render: (_, record) => renderAction(record._id),
    },
  ];

  const dataTable = events?.data?.length && events?.data?.map((event) => {
    return { ...event, key: event._id }
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateEventDetails({
      name: '',
      discountType: '',
      discountValue: '',
      startDate: '',
      endDate: '',
      applyType: '',
      appliedCriteria: '',
      status:true
    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated) {
      message.success('Cập nhật sự kiện thành công!')
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error('Cập nhật sự kiện thất bại!')
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated])

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateEvent({
      name: '',
      discountType: '',
      discountValue: '',
      startDate: '',
      endDate: '',
      applyType: '',
      appliedCriteria: '',
      status:''
    })
    form.resetFields()
  };

  const onFinish = () => {
    if (stateEvent.discountType === 'percentage' && (stateEvent.discountValue < 0 || stateEvent.discountValue > 100)) {
      form.setFields([
        {
          name: 'discountValue',
          errors: ['Percentage value must be between 0 and 100!'],
        },
      ]);
      return; // Ngừng tiếp tục nếu có lỗi
    }
    const params = {
      name:  stateEvent.name,
      discountType: stateEvent.discountType ,
      discountValue: stateEvent.discountValue ,
      startDate:  stateEvent.startDate,
      endDate:  stateEvent.endDate,
      applyType:  stateEvent.applyType,
      appliedCriteria: stateEvent.appliedCriteria,
      status: stateEvent.status
    }
    console.log('Params:', params);
    mutation.mutate(params, {
      onSettled: () => {
        queryEvent.refetch()
      }
    })
    
  }

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setStateEvent({
      ...stateEvent,
      [name]: value
    })
    if (stateEvent.discountType === 'percentage' && (value < 0 || value > 100)) {
      form.setFields([
        {
          name: 'discountValue',
          errors: ['Percentage value must be between 0 and 100!'],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'discountValue',
          errors: [],
        },
      ]);
    } 
  }

  const handleChangeDiscountType = (value) => {
    setStateEvent((prev) => ({
      ...prev,
      discountType: value,
    }));
    if (value === 'percentage' && (stateEvent.discountValue < 0 || stateEvent.discountValue > 100)) {
      form.setFields([
        {
          name: 'discountValue',
          errors: ['Percentage value must be between 0 and 100!'],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'discountValue',
          errors: [],
        },
      ]);
    }
  };

  const handleChangeApplyType = (value) => {
    setStateEvent((prev) => ({
      ...prev,
      applyType: value,
    }));

  };
  const handleChangeAppliedCriteria =(value =>{
    setStateEvent((prev) => ({
      ...prev,
      appliedCriteria: value,
    }));
  })

  const handleDateChange = (date, name) => {
    if (date && moment(date).isValid()) {
      console.log("date: ", date);
      setStateEvent((prevState) => ({ ...prevState, [name]: date }));
    } else {
      message.error('Invalid date');
    }
  };
  

  const handleOnchangeDetails = (e) => {
    setStateEventDetails({
      ...stateEventDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeDetailsDiscountType = (value) => {
    setStateEventDetails((prev) => ({
      ...prev,
      discountType: value,
    }));
  };

  // const handleChangeDetailsApplyType = (value) => {
  //   setStateEventDetails((prev) => ({
  //     ...prev,
  //     applyType: value,
  //   }));
  // };

  const handleDateChangeDetail = (date, name) => {
    if (date && moment(date).isValid()) {
      console.log("date: ", date);
      setStateEventDetails((prev) => ({ ...prev, [name]: date.toISOString() }));
    } else {
      message.error('Invalid date');
    }
  };
  const handleChangeDetailsAppliedCriteria = (value) => {
    setStateEventDetails((prevState) => {
      const updatedState = {
          ...prevState,
          appliedCriteria: value,
      };
      console.log("Updated State Event Details:", updatedState); // Log sau cập nhật
      return updatedState;
  });
  };
  

  const onUpdateEvent = () => {
    console.log("State Event Details:", stateEventDetails);
    if (!stateEventDetails.appliedCriteria && stateEventDetails.applyType === 'brand') {
      console.error("Applied Criteria is missing!");
      return; // Ngăn submit nếu thiếu dữ liệu
  }
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateEventDetails }, {
      onSettled: () => {
        queryEvent.refetch()
      }
    })
  }
  const handleChangeDetailsApplyType = (value) => {
    console.log("Selected Apply Type:", value);
    setStateEventDetails((prevState) => ({
      ...prevState,
      applyType: value,
      appliedCriteria: value === 'brand' ? prevState.appliedCriteria : null, // Giữ hoặc đặt giá trị mặc định
    }));

  };
  
  


  return (
    <div>
      <WrapperHeader>Quản lý sự kiện</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <GlobalStyle/>
        <TableComponent  columns={columns} isPending={isPendingEvents} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <ModalComponent forceRender title="Tạo sự kiện" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isPending={isPending}>

          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Event Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateEvent['name']} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[{ required: true, message: 'Please select the Discount Type!' }]}
            >
              <Select
                name="discountType"
                value={stateEvent.discountType}
                onChange={handleChangeDiscountType}
                options={[
                  { value: 'amount', label: 'Giảm theo mệnh giá tiền' },
                  { value: 'percentage', label: 'Giảm theo phần trăm' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Discount Value"
              name="discountValue"
              rules={[
                { required: true, message: 'Please input your Discount Value!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discountType = getFieldValue('discountType'); // Lấy giá trị discountType
                    if (!value) {
                      return Promise.reject(new Error('Please input your Discount Value!'));
                    }
                    if (discountType === 'percentage' && (value < 0 || value > 100)) {
                      return Promise.reject(new Error('Percentage value must be between 0 and 100!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputComponent value={stateEvent.discountValue} onChange={handleOnchange} name="discountValue"  type="number" />
            </Form.Item>

            <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select start date!' }]}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                value={stateEvent.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
              />
            </Form.Item>

            <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please select end date!' }]}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                value={stateEvent.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
              />
            </Form.Item>

            <Form.Item
              label="Apply Type"
              name="applyType"
              rules={[{ required: true, message: 'Please select the Apply Type!' }]}
            >
              <Select
                name="discountType"
                value={stateEvent.applyType}
                onChange={handleChangeApplyType}
                options={[
                  { value: 'brand', label: 'Thương hiệu' },
                  { value: 'inventory', label: 'Tồn kho' }, 
                  { value: 'all', label: 'Tất cả sản phẩm' },
                ]}
              />
            </Form.Item>
            {stateEvent.applyType === 'brand' &&(
            <Form.Item
              label="Apply Criteria"
              name="appliedCriteria"
              rules={[{ required: true, message: 'Please select the Apply Criteria!' }]}
            >
              <Select
                name="discountType"
                value={stateEvent.appliedCriteria}
                onChange={handleChangeAppliedCriteria}
                options={brands.map((brand) => ({
                  label: brand, // Hiển thị tên thương hiệu
                  value: brand, // Giá trị được lưu khi chọn
              }))}
              />
            </Form.Item>
            )}
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sự kiện' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateEvent}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Event Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateEventDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[{ required: true, message: 'Please select the device type!' }]}
            >
              <Select
                name="discountType"
                value={stateEventDetails.discountType}
                onChange={handleChangeDetailsDiscountType}
                options={[
                  { value: 'amount', label: 'Giảm theo mệnh giá tiền' },
                  { value: 'percentage', label: 'Giảm theo phần trăm' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Discount Value"
              name="discountValue"
              rules={[
                { required: true, message: 'Please input your Discount Value!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discountType = getFieldValue('discountType'); // Lấy giá trị discountType
                    if (!value) {
                      return Promise.reject(new Error('Please input your Discount Value!'));
                    }
                    if (discountType === 'percentage' && (value < 0 || value > 100)) {
                      return Promise.reject(new Error('Percentage value must be between 0 and 100!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputComponent value={stateEventDetails.discountValue} onChange={handleOnchangeDetails} name="discountValue"  type="number" />
            </Form.Item>
            <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select start date!' }]}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                value={stateEventDetails.startDate ? moment(stateEventDetails.startDate) : null}
                onChange={(date) => handleDateChangeDetail(date, 'startDate')}
              />
            </Form.Item>

            <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please select end date!' }]}>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                value={stateEventDetails.endDate ? moment(stateEventDetails.endDate) : null}
                onChange={(date) => handleDateChangeDetail(date, 'endDate')}
              />
            </Form.Item>

            <Form.Item
              label="Apply Type"
              name="applyType"
              rules={[{ required: true, message: 'Please select the Apply Type!' }]}
            >
              <Select
                name="applyType"
                value={stateEventDetails.applyType}
                onChange={(value) => {
                  handleChangeDetailsApplyType(value);
                }}
                options={[
                  { value: 'brand', label: 'Thương hiệu' },
                  { value: 'inventory', label: 'Tồn kho' }, 
                  { value: 'all', label: 'Tất cả sản phẩm' },
                ]}
              />
            </Form.Item>
            {stateEventDetails.applyType === 'brand' &&(
            <Form.Item
              label="Apply Criteria"
              name="appliedCriteria"
              rules={[{ required: true, message: 'Please select the Apply Criteria!' }]}
            >
              <Select
                name="appliedCriteria"
                value={stateEventDetails.appliedCriteria}
                onChange={handleChangeDetailsAppliedCriteria}
                options={brands?.map((brand) => ({
                  label: brand,  
                  value: brand,  
              }))}
              />
            </Form.Item>
            )}
           
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent title="Xóa sự kiện" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteEvent}>
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa sự kiện này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminEvent;
