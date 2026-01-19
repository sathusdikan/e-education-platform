import React from 'react';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const Spinner = styled.div`
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  border-top: 4px solid #667eea;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
}

export default LoadingSpinner;

