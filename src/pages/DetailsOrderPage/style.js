import styled from "styled-components"

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const WrapperInfoUser = styled.div`
  .name-info {
    font-size: 13px;
    color: rgb(36, 36, 36);
    font-weight: bold;
    text-transform: uppercase;
  }
  .address,.phone-info,.delivery-info,.delivery-fee,.payment-info {
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    margin-top: 8px;
  }
  .name-delivery {
    color: rgb(234, 133, 0); 
    font-weight: bold;
    text-transform: uppercase;
  }
  .status-payment {
    margin-top: 8px;
    color: rgb(234, 133, 0); 
  }
`

export const WrapperLabel = styled.div`
  color: rgb(36, 36, 36);
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 15px;
`
export const WrapperContentInfo = styled.div`
  height: 118px;
  width: 320px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`
export const WrapperContentProduct = styled.div`
  height: 80px;
  width: 650px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`

export const WrapperContentProductInfo = styled.div`
  height: 80px;
  width: 180px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`
export const WrapperContentProductBill = styled.div`
  height: 30px;
  width: 150px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`
export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  justify-content: space-between;
`


export const WrapperNameProduct = styled.div`
  display:flex;
  align-items: flex-start;
  width: 360px;
`

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  &:last-child {
    color: red
  }
`
export const WrapperItemLabel = styled.div`
  &:last-child {
    font-weight: bold;
  }
`
export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
`