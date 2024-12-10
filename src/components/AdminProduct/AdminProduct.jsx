import { Button, Form, Select, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import axios from 'axios';

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isPendingUpdate, setisPendingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user) 
  const searchInput = useRef(null);
  const inittial = (deviceType = null) => {
    const baseFields = {
      name: '',
      price: '',
      type: '',
      countInStock: '',
      newType: '',
      discount: '',
      relatedImages: [],
      image: '',
      rating: '',
      deviceType: deviceType || '',
    };
  
    const specsTemplate = {
      phone: {
        screen: '',
        os: '',
        camera: '',
        cameraFront: '',
        cpu: '',
        ram: '',
        rom: '',
        microUSB: '',
        battery: '',
      },
      watch: {
        screen: '',
        os: '',
        battery: '',
        bluetooth: '',
        sensors: '',
        size: '',
        feature: '',
        strap: '',
        material: '',
      },
      laptop: {
        screen: '',
        os: '',
        cpu: '',
        ram: '',
        rom: '',
        battery: '',
        ports: '',
        chipCard: '',
        sound: '',
        design: '',
        feature: '',
      },
      tablet: {
        screen: '',
        os: '',
        camera: '',
        cpu: '',
        ram: '',
        rom: '',
        battery: '',
        processorGraphics: '',
        design: '',
        ports: '',
        feature: '',
      },
      headphone: {
        bluetooth: '',
        battery: '',
        length: '',
        noiseCancellation: false,
        ports: '',
        scope: '',
        material: '',
        design: '',
        feature: '',
      },
      loudspeaker: {
        bluetooth: '',
        battery: '',
        waterproof: false,
        design: '',
        connectControl: '',
        audio: '',
      },
    };
  
    // Thêm specs dựa trên deviceType
    return {
      ...baseFields,
      ...(deviceType ? specsTemplate[deviceType] : {}),
    };
  };
  
  const [stateProduct, setStateProduct] = useState(inittial());

  const [stateProductDetails, setStateProductDetails] = useState(inittial())

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      type,
      deviceType,
      countInStock,
      discount,
      relatedImages,
      image,
      rating,
      ...specs // Tách phần thông số kỹ thuật động
    } = data;

    // Xác định tên của trường specs dựa trên deviceType
    const specsField = `${deviceType}Specs`;

    // Chuẩn bị payload
    const payload = {
      name,
      price,
      type,
      deviceType,
      countInStock,
      discount,
      relatedImages,
      image,
      rating,
      [specsField]: specs, // Gán thông số kỹ thuật vào đúng field
    };

    // Gọi API để tạo sản phẩm
    return ProductService.createProduct(payload);
  });

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, 
        name,
        price,
        type,
        deviceType,
        countInStock,
        discount,
        relatedImages,
        image,
        rating,
        ...specs} = data;
      
      // Xác định tên trường specs dựa trên deviceType
      const specsField = `${deviceType}Specs`;
  
      // Chuyển phần specs vào đúng trường trong payload
      const payload = {
        id,
        token,
        name,
        price,
        type,
        deviceType,
        countInStock,
        discount,
        image,
        rating,
        [specsField]: specs, // Gán thông số kỹ thuật vào đúng field dựa trên deviceType
        relatedImages: data.relatedImages,
      };
      
      const res = ProductService.updateProduct(id, token, payload);
      return res;
    }
  );
  

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token)
      return res
    },
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token)
      return res
    },
  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    setisPendingUpdate(true);
  
    try {
      const res = await ProductService.getDetailsProduct(rowSelected);
  
      if (res?.data) {
        const {
          name,
          price,
          type,
          deviceType,
          countInStock,
          discount,
          relatedImages,
          image,
          rating,
          ...specs
        } = res.data;
  
        // Lấy thông số kỹ thuật đúng loại thiết bị
        const deviceSpecs = specs[`${deviceType}Specs`] || {};
  
        setStateProductDetails({
          name,
          price,
          type,
          deviceType,
          countInStock,
          discount,
          relatedImages,
          image,
          rating,
          ...deviceSpecs, // Gộp thông số kỹ thuật vào state
        });
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setisPendingUpdate(false);
    }
  };

  useEffect(() => {
    if(!isModalOpen) {
      form.setFieldsValue(stateProductDetails)
    }else {
      form.setFieldsValue(inittial())
    }
  }, [form, stateProductDetails, isModalOpen])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setisPendingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }

  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany


  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const { isPending: isPendingProducts, data: products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }


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
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 10.000.000',
          value: '>=',
        },
        {
          text: '< 10.000.000',
          value: '<',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 10000000
        }
        return record.price < 10000000
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 3',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      ...getColumnSearchProps('type')
    },
    {
      title: 'Device Type',
      dataIndex: 'deviceType',
      filters: [
        { text: 'Phone', value: 'phone' },
        { text: 'Tablet', value: 'tablet' },
        { text: 'Headphone', value: 'headphone' },
        { text: 'Watch', value: 'watch' },
        { text: 'Loudspeaker', value: 'loudspeaker' },
        { text: 'Laptop', value: 'laptop' },
      ],
      onFilter: (value, record) => record.deviceType === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  
    // Reset stateProductDetails về giá trị mặc định
    setStateProductDetails({
      name: '',
      price: '',
      deviceType: '',
      type: '',
      countInStock: '',
      discount: '',
      rating: '',
      image: '',
      relatedImages: [],
      // Reset tất cả specs
      screen: '',
      os: '',
      camera: '',
      cameraFront: '',
      cpu: '',
      ram: '',
      rom: '',
      microUSB: '',
      battery: '',
      bluetooth: '',
      ports: '',
      design: '',
      sensors: '',
      feature: '',
      material: '',
      size: '',
      waterproof: '',
      noiseCancellation: '',
      strap: '',
      chipCard:'',
      sound:'',
      connectControl:'',
      audio:'',
      scope:'',
      processorGraphics: '',  
      length: ''
    });
  
    // Reset các field trong form
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

const handleCancel = () => {
  setIsModalOpen(false);

  // Reset stateProduct về giá trị mặc định
  setStateProduct({
    name: '',
    price: '',
    deviceType: '',
    type: '',
    countInStock: '',
    discount: '',
    rating: '',
    image: '',
    relatedImages: [],
    // Reset tất cả thông số kỹ thuật
    screen: '',
    os: '',
    camera: '',
    cameraFront: '',
    cpu: '',
    ram: '',
    rom: '',
    microUSB: '',
    battery: '',
    bluetooth: '',
    ports: '',
    design: '',
    sensors: '',
    feature: '',
    material: '',
    size: '',
    waterproof: '',
    noiseCancellation: '',
    strap: '',
    chipCard: '',
    sound: '',
    connectControl: '',
    audio: '',
    scope: '',
    processorGraphics: '',  
    length: ''
  });

  // Reset các field trong form
  form.resetFields();
};

const onFinish = () => {
    // Khởi tạo params chung
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
      relatedImages: stateProduct.relatedImages,
      rating: stateProduct.rating,
      deviceType: stateProduct.deviceType,
    
    };

    console.log("params before mutation:", params);

    // Thêm thông số kỹ thuật theo loại thiết bị
 // Dynamically append specs based on deviceType
    switch (stateProduct.deviceType) {
      case 'phone':
        params.screen = stateProduct.screen;
        params.os = stateProduct.os;
        params.camera = stateProduct.camera;
        params.cameraFront = stateProduct.cameraFront;
        params.cpu = stateProduct.cpu;
        params.ram = stateProduct.ram;
        params.rom = stateProduct.rom;
        params.microUSB = stateProduct.microUSB;
        params.battery = stateProduct.battery;
        break;

      case 'watch':
        params.screen = stateProduct.screen;
        params.os = stateProduct.os;
        params.battery = stateProduct.battery;
        params.bluetooth = stateProduct.bluetooth;
        params.sensors = stateProduct.sensors;
        params.size = stateProduct.size;
        params.feature = stateProduct.feature;
        params.strap = stateProduct.strap;
        params.material = stateProduct.material;
        break;

      case 'laptop':
        params.screen = stateProduct.screen;
        params.os = stateProduct.os;
        params.cpu = stateProduct.cpu;
        params.ram = stateProduct.ram;
        params.rom = stateProduct.rom;
        params.battery = stateProduct.battery;
        params.ports = stateProduct.ports;
        params.chipCard = stateProduct.chipCard;
        params.sound = stateProduct.sound;
        params.design = stateProduct.design;
        params.feature = stateProduct.feature;
        break;

      case 'tablet':
        params.screen = stateProduct.screen;
        params.os = stateProduct.os;
        params.camera = stateProduct.camera;
        params.cpu = stateProduct.cpu;
        params.ram = stateProduct.ram;
        params.rom = stateProduct.rom;
        params.battery = stateProduct.battery;
        params.processorGraphics = stateProduct.processorGraphics;
        params.design = stateProduct.design;
        params.ports = stateProduct.ports;
        params.feature = stateProduct.feature;
        break;

      case 'headphone':
        params.bluetooth = stateProduct.bluetooth;
        params.battery = stateProduct.battery;
        params.length = stateProduct.length;
        params.noiseCancellation = stateProduct.noiseCancellation;
        params.ports = stateProduct.ports;
        params.scope = stateProduct.scope;
        params.material = stateProduct.material;
        params.design = stateProduct.design;
        params.feature = stateProduct.feature;
        break;

      case 'loudspeaker':
        params.bluetooth = stateProduct.bluetooth;
        params.battery = stateProduct.battery;
        params.waterproof = stateProduct.waterproof;
        params.design = stateProduct.design;
        params.connectControl = stateProduct.connectControl;
        params.audio = stateProduct.audio;
        break;
        
      default:
        console.warn('Unsupported deviceType');
        break;
    }

   

    // Gọi mutate với params
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });

    

  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
    console.log("Updating with fields:", stateProductDetails);
  }

  // const handleOnchangeAvatar = async ({ fileList }) => {
  //   const file = fileList[0]
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStateProduct({
  //     ...stateProduct,
  //     image: file.preview
  //   })
  // }

  // const handleOnchangeAvatarDetails = async ({ fileList }) => {
  //   const file = fileList[0]
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStateProductDetails({
  //     ...stateProductDetails,
  //     image: file.preview
  //   })
  // }

  // const handleOnchangeRelatedImages = async ({ fileList }) => {
  //   const relatedImages = await Promise.all(
  //     fileList.map(async (file) => {
  //       if (!file.url && !file.preview) {
  //         file.preview = await getBase64(file.originFileObj);
  //       }
  //       return file.preview;
  //     })
  //   );
  //   setStateProduct({
  //     ...stateProduct,
  //     relatedImages: relatedImages
  //   });
  // };
  
  // const handleOnchangeRelatedImagesDetails = async ({ fileList }) => {
  //   const relatedImages = await Promise.all(
  //     fileList.map(async (file) => {
  //       if (!file.url && !file.preview) {
  //         file.preview = await getBase64(file.originFileObj);
  //       }
  //       return file.preview;
  //     })
  //   );
  //   setStateProductDetails({
  //     ...stateProductDetails,
  //     relatedImages: relatedImages
  //   });
  // };

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

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file.originFileObj) {
      try {
       
        const imageUrl = await uploadToCloudinary(file.originFileObj);
        setStateProduct({
          ...stateProduct,
          image: imageUrl  
        });
      } catch (error) {
        console.error("Failed to upload image", error);
      }
    }
  };
  
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (file.originFileObj) {
      try {
        
        const imageUrl = await uploadToCloudinary(file.originFileObj);
        setStateProductDetails({
          ...stateProductDetails,
          image: imageUrl  
        });
      } catch (error) {
        console.error("Failed to upload image", error);
      }
    }
  };
  
  const handleOnchangeRelatedImages = async ({ fileList }) => {
    const relatedImages = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj) {
          try {
    
            const imageUrl = await uploadToCloudinary(file.originFileObj);
            return imageUrl;
          } catch (error) {
            console.error("Failed to upload related image", error);
            return null;
          }
        }
        return null;
      })
    );
    setStateProduct({
      ...stateProduct,
      relatedImages: relatedImages.filter(url => url !== null) 
    });
  };
  
  const handleOnchangeRelatedImagesDetails = async ({ fileList }) => {
    const relatedImages = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj) {
          try {
            
            const imageUrl = await uploadToCloudinary(file.originFileObj);
            return imageUrl;
          } catch (error) {
            console.error("Failed to upload related image", error);
            return null;
          }
        }
        return null;
      })
    );
    setStateProductDetails({
      ...stateProductDetails,
      relatedImages: relatedImages.filter(url => url !== null)  
    });
  };
  

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleChangeSelect = (value) => {
      setStateProduct({
        ...stateProduct,
        type: value
      })
  }

  const renderSpecsForm = (deviceType) => {
    const specsFields = {
      phone: ['screen', 'os', 'camera', 'cameraFront', 'cpu', 'ram', 'rom', 'microUSB', 'battery'],
      watch: ['screen', 'os', 'battery', 'bluetooth', 'sensors', 'size', 'feature', 'strap', 'material'],
      laptop: ['screen', 'os', 'cpu', 'ram', 'rom', 'battery', 'ports', 'chipCard', 'sound', 'design', 'feature'],
      tablet: ['screen', 'os', 'camera', 'cpu', 'ram', 'rom', 'battery', 'processorGraphics', 'design', 'ports', 'feature'],
      headphone: ['bluetooth', 'battery', 'length', 'noiseCancellation', 'ports', 'scope', 'material', 'design', 'feature'],
      loudspeaker: ['bluetooth', 'battery', 'waterproof', 'design', 'connectControl', 'audio'],
    };
  
    const fields = specsFields[deviceType] || [];
    
    return fields.map((field) => (
      <Form.Item
        key={field}
        label={field.charAt(0).toUpperCase() + field.slice(1)}
        name={field}
        rules={[{ required: true, message: `Please input your ${field}!` }]}
      >
        <InputComponent value={stateProduct[field]} onChange={handleOnchange} name={field} />
      </Form.Item>
    ));
  };

  const renderSpecsFormUpdate = (deviceType) => {
    const specsFields = {
      phone: ['screen', 'os', 'camera', 'cameraFront', 'cpu', 'ram', 'rom', 'microUSB', 'battery'],
      watch: ['screen', 'os', 'battery', 'bluetooth', 'sensors', 'size', 'feature', 'strap', 'material'],
      laptop: ['screen', 'os', 'cpu', 'ram', 'rom', 'battery', 'ports', 'chipCard', 'sound', 'design', 'feature'],
      tablet: ['screen', 'os', 'camera', 'cpu', 'ram', 'rom', 'battery', 'processorGraphics', 'design', 'ports', 'feature'],
      headphone: ['bluetooth', 'battery', 'length', 'noiseCancellation', 'ports', 'scope', 'material', 'design', 'feature'],
      loudspeaker: ['bluetooth', 'battery', 'waterproof', 'design', 'connectControl', 'audio'],
    };
  
    const fields = specsFields[deviceType] || [];
  
    return fields.map((field) => (
      <Form.Item
        key={field}
        label={field.charAt(0).toUpperCase() + field.slice(1)}
        name={field}
        rules={[{ required: true, message: `Please input your ${field}!` }]}
      >
        <InputComponent
          value={stateProductDetails[field]}
          onChange={handleOnchangeDetails}
          name={field}
        />
      </Form.Item>
    ));
  };
  

  const handleChangeDeviceType = (value) => {
    setStateProduct((prev) => ({
      ...prev,
      deviceType: value,
    }));
  };


  const handleOnchangeDetailsDeviceType = (value) => {
    setStateProductDetails((prev) => ({
      ...prev,
      deviceType: value,
    }));
  };
  
  return (
    <div>
      <WrapperHeader>QUẢN LÝ SẢN PHẨM</WrapperHeader>
      <div style={{ 
        borderTop: '1px solid #000', 
        margin: '0px 0', 
        width: '20%' 
        }} />
      <div style={{ marginTop: '10px' }}>
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDelteMany={handleDelteManyProducts} columns={columns} isPending={isPendingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Device Type"
              name="deviceType"
              rules={[{ required: true, message: 'Please select the device type!' }]}
            >
              <Select
                name="deviceType"
                value={stateProduct.deviceType}
                onChange={handleChangeDeviceType}
                options={[
                  { value: 'phone', label: 'Phone' },
                  { value: 'watch', label: 'Watch' },
                  { value: 'laptop', label: 'Laptop' },
                  { value: 'tablet', label: 'Tablet' },
                  { value: 'headphone', label: 'Headphone' },
                  { value: 'loudspeaker', label: 'Loudspeaker' },
                ]}
              />
            </Form.Item>

            {/* Render dynamic form fields based on deviceType */}
            {stateProduct.deviceType && renderSpecsForm(stateProduct.deviceType)}

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
                />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item
                label='New type'
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your count price!' }]}
            >
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount of product!' }]}
            >
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your count image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button >Select File</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              label="Related Images"
              name="relatedImages"
              rules={[{ required: true, message: 'Please upload related images!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeRelatedImages} maxCount={6} multiple>
                <Button>Select Files</Button>
                {stateProduct?.relatedImages?.length > 0 && (
                  stateProduct.relatedImages.map((img, index) => (
                    <img key={index} src={img} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                    }} alt="related-img" />
                  ))
                )}
              </WrapperUploadFile>
            </Form.Item>


            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isPending={isPendingUpdate || isPendingUpdated}>

          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateProductDetails['type']} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your count price!' }]}
            >
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>

            <Form.Item
              label="Device Type"
              name="deviceType"
              rules={[{ required: true, message: 'Please select the device type!' }]}
            >
              <Select
                name="deviceType"
                value={stateProductDetails.deviceType}
                onChange={handleOnchangeDetailsDeviceType}
                options={[
                  { value: 'phone', label: 'Phone' },
                  { value: 'watch', label: 'Watch' },
                  { value: 'laptop', label: 'Laptop' },
                  { value: 'tablet', label: 'Tablet' },
                  { value: 'headphone', label: 'Headphone' },
                  { value: 'loudspeaker', label: 'Loudspeaker' },
                ]}
              />
            </Form.Item>

            {stateProductDetails.deviceType && renderSpecsFormUpdate(stateProductDetails.deviceType)}

            {/* <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please input your count rating!' }]}
            >
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item> */}
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount of product!' }]}
            >
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your count image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button >Select File</Button>
                {stateProductDetails?.image && (
                  <img src={stateProductDetails?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              label="Related Images"
              name="relatedImages"
              rules={[{ required: true, message: 'Please upload related images!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeRelatedImagesDetails} maxCount={6} multiple>
                <Button>Select Files</Button>
                {stateProductDetails?.relatedImages?.length > 0 && (
                  stateProductDetails.relatedImages.map((img, index) => (
                    <img key={index} src={img} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                    }} alt="related-img" />
                  ))
                )}
              </WrapperUploadFile>
            </Form.Item>


            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct