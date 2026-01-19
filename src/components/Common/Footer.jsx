import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1rem;
    color: #ecf0f1;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: #bdc3c7;
        text-decoration: none;
        transition: color 0.3s;
        
        &:hover {
          color: white;
        }
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    color: #bdc3c7;
    font-size: 1.5rem;
    transition: color 0.3s;
    
    &:hover {
      color: #667eea;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  color: #95a5a6;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>EduLearn</h3>
          <p style={{ color: '#bdc3c7' }}>
            Your trusted online learning platform for Mathematics, Chemistry, and Physics.
            Master STEM subjects with expert instructors and interactive content.
          </p>
          <SocialLinks>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="Email"><FaEnvelope /></a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Subjects</h3>
          <ul>
            <li><Link to="/subject/math">Mathematics</Link></li>
            <li><Link to="/subject/chemistry">Chemistry</Link></li>
            <li><Link to="/subject/physics">Physics</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} EduLearn. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;

