import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 0px;
    justify-content: flex-start;
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
const flashingBackground = `
  @keyframes flashingBackground {
    0% {
      background-color: orange;
    }
    50% {
      background-color: #2980B9;
    }
    100% {
      background-color: orange;
    }
  }
`;
export const WrapperProducts = styled.div`
    ${flashingBackground}  
    padding: 20px;
    border-radius: 8px;
    animation: flashingBackground 1s infinite; 
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
      background-color: green;
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
    animation: flashingBackground2 1s infinite; 
    display: flex;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap
`

export const BlinkTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin: 5px 0;
    animation: blink 1.5s infinite;

    @keyframes blink {
        0% {
            opacity: 1;
            color: #ff5733;  
        }
        50% {
            opacity: 0.5;
            color: #33ff57;  
        }
        100% {
            opacity: 1;
            color: red;  
        }
    }
`;