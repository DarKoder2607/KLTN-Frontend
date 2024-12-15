import { useEffect, useRef, useState } from "react";
import { chatbotChat } from "../../services/UserService";  
import { CaretDownOutlined, CloseOutlined, CommentOutlined, RobotFilled, SendOutlined } from "@ant-design/icons";
import { BotMessage, BotMessageError, ChatBody, ChatButton, ChatContainer, ChatFooter, ChatForm, ChatHeader, ChatInput, ChatPopup, ChatToggler, HeaderInfo, LogoText, UserMessage } from "./styled";
import imagelogo from '../../assets/images/logo.png'
const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: false,
      role: "model",
      text: "Xin chào 👋 Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);

  const chatBodyRef = useRef();
  const inputRef = useRef();
 
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking....."),{ role: "model", text, isError },]);
      
    };

    try { 
      const response = await chatbotChat({ message: history.at(-1).text });
      setTimeout(() => {
        updateHistory(response.data.text);  
      }, 600); 
    } catch (error) {
      updateHistory(error.message || "Something went wrong!", true);
    }
  };
 
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);
 
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";
 
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);
 
    setChatHistory((history) => [
      ...history,
      { role: "model", text: "Thinking....." },
    ]);
 
    generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
  };

  return (
    <ChatContainer>
      <ChatToggler
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
        showChatbot={showChatbot}
      >
        {showChatbot ? (
          <CloseOutlined style={{ fontSize: "35px" }} />
        ) : (
          <CommentOutlined style={{ fontSize: "35px" }} />
        )}
      </ChatToggler>
      <ChatPopup showChatbot={showChatbot}> 
        <ChatHeader>
          <HeaderInfo>
            <img src={imagelogo} alt="Logo" style={{ width: '70px', height: '70px' }} />
            <LogoText>Hỗ trợ khách hàng</LogoText>
          </HeaderInfo>
          <CaretDownOutlined
            className="button"
            style={{ fontSize: "25px" }}
            onClick={() => setShowChatbot((prev) => !prev)}
          />
        </ChatHeader>
 
        <ChatBody ref={chatBodyRef}>
          {chatHistory.map((chat, index) =>
            !chat.hideInChat ? (
              chat.role === "model" ? (
                chat.isError ? (
                  <BotMessageError key={index}>
                    <RobotFilled />
                    <p className="message-text">{chat.text}</p>
                  </BotMessageError>
                ) : (
                  <BotMessage key={index}>
                    <RobotFilled />
                    <p className="message-text">{chat.text}</p>
                  </BotMessage>
                )
              ) : (
                <UserMessage key={index}>
                  <p className="message-text">{chat.text}</p>
                </UserMessage>
              )
            ) : null
          )}
        </ChatBody>
 
        <ChatFooter>
          <ChatForm action="#" onSubmit={handleFormSubmit}>
            <ChatInput ref={inputRef} type="text" placeholder="Message..." required />
            <ChatButton>
              <SendOutlined
                style={{
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </ChatButton>
          </ChatForm>
        </ChatFooter>
      </ChatPopup>
    </ChatContainer>
  );
};

export default Chatbot;
