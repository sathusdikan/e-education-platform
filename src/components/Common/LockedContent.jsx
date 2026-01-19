import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaCreditCard } from 'react-icons/fa';

const LockedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  margin: 2rem 0;
`;

const LockIcon = styled.div`
  font-size: 5rem;
  color: #95a5a6;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Message = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const SubscribeButton = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
`;

function LockedContent({ title = 'Content Locked', message }) {
  return (
    <LockedContainer>
      <LockIcon>
        <FaLock />
      </LockIcon>
      <Title>{title}</Title>
      <Message>
        {message || 'This content is available only for subscribed members. Subscribe now to unlock all courses, videos, and quizzes!'}
      </Message>
      <SubscribeButton to="/pricing">
        <FaCreditCard /> Subscribe to Access
      </SubscribeButton>
    </LockedContainer>
  );
}

export default LockedContent;

