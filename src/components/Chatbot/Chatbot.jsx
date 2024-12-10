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

  // Gửi tin nhắn đến API và nhận phản hồi từ chatbot
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking....."),{ role: "model", text, isError },]);
      
    };

    try {
      // Lấy phản hồi từ API
      const response = await chatbotChat({ message: history.at(-1).text });
      setTimeout(() => {
        updateHistory(response.data.text); // Sử dụng phản hồi từ API
      }, 600); 
    } catch (error) {
      updateHistory(error.message || "Something went wrong!", true);
    }
  };

  // Xử lý cuộn tự động khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Xử lý gửi tin nhắn
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Cập nhật lịch sử với tin nhắn của người dùng
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Thêm placeholder để chờ phản hồi từ bot
    setChatHistory((history) => [
      ...history,
      { role: "model", text: "Thinking....." },
    ]);

    // Gửi tin nhắn của người dùng tới API
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
        {/* Chat header */}
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

        {/* Chat body */}
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

        {/* Chat footer */}
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
