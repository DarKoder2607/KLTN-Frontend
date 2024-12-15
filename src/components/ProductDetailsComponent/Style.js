import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;

`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
    
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36,36,36);
    font-size: 30px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
    font-weight: bold
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120)
`
export const WrapperCounInStockProduct = styled.div`
    background: rgb(250,250,250);
    border-radius: 4px;
`

export const WrapperStyleTextCounInStock = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120)
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250,250,250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
    span.origin-price{
        font-size: 32px;
        line-height: 40px;
        margin-right: 8px;
        font-weight: 500;
        padding: 10px;
        margin-top: 10px;
    },
    span.discount-price {
        font-size: 32px;
        line-height: 40px;
        margin-right: 8px;
        font-weight: 500;
        padding: 10px;
        margin-top: 10px;
        color: red
    }
`

export const WrapperAddressProduct = styled.div`
    span.address{
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    },
    span.change-address{
        color: rgb(11,116,229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500; 
        cursor : pointer
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`



export const WrapperInputNumber= styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 60px;
        border-top: none;
        border-bottom: none;
        &.ant-input-number-handler-wrap{
            display: none;
        }
    };
    
`
const flashingBackground2 = `
  @keyframes flashingBackground2 {
    0% {
      background-color: red;
    }
    50% {
      background-color: rgb(13,92,182);
    }
    100% {
      background-color: red;
    }
  }
`;
export const WrapperProducts2 = styled.div`
    ${flashingBackground2}  
    padding: 20px;
    border-radius: 8px;
    animation: flashingBackground2 2s infinite; 
    display: flex;
    gap: 40px;
    margin-top: 20px;
    flex-wrap: wrap
`

export const BlinkTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin: 5px 0;
    animation: blink 2s infinite;

    @keyframes blink {
        0% {
            opacity: 1;
            color: #ff5733;  
        }
        50% {
            opacity: 0.5;
            color: green;  
        }
        100% {
            opacity: 1;
            color: red;  
        }
    }
`;