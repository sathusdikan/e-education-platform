import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.3s;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  margin-top: 1rem;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <LoginContainer>
      <Title>Login to Your Account</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>
            <FaEnvelope /> Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <FaLock /> Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={loading}>
          <FaSignInAlt /> {loading ? 'Logging in...' : 'Login'}
        </SubmitButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>

      <LinkContainer>
        <p>
          Don't have an account?{' '}
          <StyledLink to="/register">Register here</StyledLink>
        </p>
        <p>
          <StyledLink to="/">Back to Home</StyledLink>
        </p>
      </LinkContainer>
    </LoginContainer>
  );
}

export default Login;