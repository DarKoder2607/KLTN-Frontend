import styled, { css } from "styled-components";

export const ChatContainer = styled.div`
  position: relative;

`;
export const ChatToggler = styled.button`
  position: fixed;
  bottom: 30px;
  right: 35px;
  border: none;
  height: 50px;
  width: 50px;
  display: flex;
  cursor: pointer;
  border-radius: 50%;
  background: #0033CC;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  transform: ${({ showChatbot }) => (showChatbot ? 'rotate(90deg)' : 'rotate(0deg)')};
  & span {
    position: absolute;
    color: #fff;
    display: flex;
    justify-content: center;  /* Canh giữa theo chiều ngang */
    align-items: center;
  }
    
`;



export const ChatPopup = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;
  bottom: 90px;
  right: 35px;
  width: 400px;
  transfom: scale(0.2);
  overflow: hidden;
  background: #fff;
  border-radius: 15px;
  transform-origin: bottom right;
  box-shadow: 0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5);
  transition: all 0.1s ease;
  ${({ showChatbot }) =>
    showChatbot &&
    css`
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    `}
`;

export const ChatHeader = styled.div`
  background: #0033CC;
  display: flex;
  padding: 15px 22px;
  align-items: center;
  justify-content: space-between;
  .button{
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    color: #fff;
    cursor: pointer;
    font-size: 1.9rem;
    padding-top: 2px;
    margin-right: -10px;
    background: none;
    transition: 0.2s ease;
    &:hover{
      border-radius: 50%;
      color: #000;
      background: #593bab;
    }
  }

`;

export const HeaderInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  svg{
    height: 35px;
    width: 35px;
    padding: 6px;
    flex-shrink: 0;
    fill: #6D4FC2;
    background: #fff;
    border-radius: 30%;
  }
`;

export const LogoText = styled.h2`
  color: #fff;
  font-size: 2.31rem;
  font-weight: 600;
`;


export const ChatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 82px;
  height: 300px;
  overflow-y: auto;
  padding: 25px 22px;
  scrollbar-width: thin;
  scrollbar-color: #DDD3F9 transparent;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #DDD3F9;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;



export const ChatFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 92%;
  background: #fff;
  padding: 15px 22px 22px;
`;

export const ChatForm = styled.form`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  outline: 1px solid #cccce5;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);

  &:focus-within {
    outline: 2px solid #6d4fc2;
  }
`;

export const ChatInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  background: none;
  height: 47px;
  padding: 0 24px;
  font-size: 1.95rem;
`;

export const ChatButton = styled.button`
  height: 35px;
  width: 35px;
  color: #fff;
  flex-shrink: 0;
  border: none;
  display: none;
  outline: none;
  cursor: pointer;
  font-size: 1.15rem;
  margin-right: 6px;
  border-radius: 50%;
  background: #0033cc;
  transition: 0.2s ease;
  padding

  &:hover {
    background: #593bab;
  }

  ${ChatInput}:valid ~ & {
    display: block;
  }
`;

export const Message = styled.div`
  display: flex;
  gap: 11px;
  align-items: center;
`;

export const BotMessage = styled(Message)`
  svg {
    height: 35px;
    width: 35px;
    padding: 6px;
    flex-shrink: 0;
    fill: #fff;
    align-self: flex-end;
    margin-bottom: 2px;
    background: #3399ff;
    border-radius: 30%;
  }

  .message-text {
    background: #ffffcc;
    border-radius: 13px 13px 13px 3px;
    padding: 12px 16px;
    max-width: 75%;
    word-wrap: break-word;
    white-space: pre-line;
    font-size: 1.95rem;
  }
`;

export const UserMessage = styled(Message)`
  flex-direction: column;
  align-items: flex-end;

  .message-text {
    color: #000;
    background: #ffffcc;
    border-radius: 13px 13px 3px 13px;
    padding: 12px 16px;
    max-width: 75%;
    word-wrap: break-word;
    white-space: pre-line;
    font-size: 1.95rem;
  }
`;

export const BotMessageError = styled(Message)`
  color: red;
`