import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 0px;
    justify-content: center;
    height: 60px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover{
        color: #fff;
        background: rgb(13,92,182);
        span {
            color : #fff;
        }
    }
    width: 100%;
    text-align: center;
    cursor : ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`

export const ButtonMore = styled.button`
    width: 240px;
    height: 38px;
    border: 1px solid rgb(11,116,229);
    color: rgb(11,116,229);
    border-radius: 4px;
    background: transparent;
    font-weight: normal;
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: rgb(11,116,229);
        color: white;
        font-weight: bold;
    }
`;

export const WrapperProducts = styled.div`
    padding: 20px;
    border-radius: 8px;
    display: flex;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap
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
    gap: 14px;
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