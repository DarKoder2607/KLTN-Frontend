import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(243, 156, 18);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 0;
`

export const WrapperTextHeader = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;

    .logo-image {
        width: 70px;
        height: 70px;
        transition: transform 0.3s ease-in-out;
    }

    .header-text {
        transition: color 0.3s ease-in-out;
        color: white
    }

    &:hover .logo-image {
        transform: scale(1.5);
    }

    &:hover .header-text {
        color: #FF5733;
    }
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`
export const WrapperContentPopup = styled.p`    
    &:hover{
        background:  rgb(26, 148, 255);
        color : #fff;
        padding : 5px;
    };
    cursor : pointer;
`