import styled from 'styled-components';

export const Container = styled.div`
  margin: 20px;
  width : 1160px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

export const ReviewForm = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

export const TextArea = styled.textarea`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #40a9ff;
  }
`;

export const NoReviewsMessage = styled.div`
  color: #777;
  font-style: italic;
  margin-top: 20px;
  text-align: center;
`;

export const ReviewItem = styled.div`
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;

  .ant-rate {
    font-size: 16px;
  }

  .ant-avatar {
    background-color: #1890ff;
    color: white;
  }
`;
