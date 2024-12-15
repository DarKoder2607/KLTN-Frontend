import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperType } from './styled'
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaHeadphonesAlt,  } from 'react-icons/fa'
import { MdWatch, MdSpeaker } from 'react-icons/md'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  const handleNavigatetype = (deviceType) => {
    navigate(`/product/${deviceType.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: deviceType})
  }
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'laptop':
        return <FaLaptop style={{ marginRight: '8px' }} />
      case 'phone':
        return <FaMobileAlt style={{ marginRight: '8px' }} />
      case 'tablet':
        return <FaTabletAlt style={{ marginRight: '8px' }} />
      case 'audio':
        return <FaHeadphonesAlt style={{ marginRight: '8px' }} />
      case 'watch':
        return <MdWatch style={{ marginRight: '8px' }} />
      case 'loudspeaker':
        return <MdSpeaker style={{ marginRight: '8px' }} />
      default:
        return null
    }
  }
  const productTypeMapping = {
    laptop: 'Máy tính xách tay',
    phone: 'Điện thoại di động',
    tablet: 'Máy tính bảng',
    audio: 'Tai nghe',
    watch: 'Đồng hồ đeo tay',
    loudspeaker : 'Loa điện tử'
    // Add more mappings as needed
  };
  return (
    <WrapperType onClick={() => handleNavigatetype(name)}>{getIcon(name)}{productTypeMapping[name.toLowerCase()] || name}</WrapperType>
  )
}

export default TypeProduct