import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaHome, 
  FaBook, 
  FaChalkboardTeacher,
  FaShoppingCart,
  FaBars,
  FaTimes 
} from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #f0f0f0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #667eea;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
  
  &:hover {
    color: #f0f0f0;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubscriptionBadge = styled.span`
  background: ${({ active }) => active ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function Navbar() {
  const { user, logout, hasActiveSubscription, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <FaChalkboardTeacher /> EduLearn
        </Logo>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/">
            <FaHome /> Home
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/dashboard">
                <FaBook /> Dashboard
              </NavLink>
              
              {isAdmin() ? (
                <NavLink to="/admin">
                  <FaChalkboardTeacher /> Admin
                </NavLink>
              ) : (
                <NavLink to="/pricing">
                  <FaShoppingCart /> Pricing
                </NavLink>
              )}
            </>
          )}
          
          {!user && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>

        {user && (
          <UserSection>
            <UserInfo>
              <FaUser />
              <span>{user.name}</span>
              {!isAdmin() && (
                <SubscriptionBadge active={hasActiveSubscription()}>
                  {hasActiveSubscription() ? 'Active' : 'Inactive'}
                </SubscriptionBadge>
              )}
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </UserSection>
        )}
      </NavContent>
    </NavbarContainer>
  );
}

export default Navbar;