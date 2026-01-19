import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaUsers,
  FaBook,
  FaVideo,
  FaChartPie
} from 'react-icons/fa';
import SubjectManager from './SubjectManager';
import VideoManager from './VideoManager';
import QuizManager from './QuizManager';
import StudentManager from './StudentManager';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 10px;
  }
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const AdminNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  background: ${({ active }) => active ? '#667eea' : 'white'};
  color: ${({ active }) => active ? 'white' : '#333'};
  border: 1px solid #ddd;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ active }) => active ? '#5a6fd8' : '#f5f5f5'};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 5px;
  }
`;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSubscriptions: 0,
    totalVideos: 0,
    totalQuizzes: 0
  });

  useEffect(() => {
    // Load stats from localStorage or API
    const loadStats = () => {
      const students = JSON.parse(localStorage.getItem('users') || '[]');
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      
      setStats({
        totalStudents: students.filter(u => u.role === 'student').length,
        activeSubscriptions: students.filter(u => 
          u.role === 'student' && 
          u.subscription?.status === 'active'
        ).length,
        totalVideos: videos.length,
        totalQuizzes: quizzes.length
      });
    };
    
    loadStats();
  }, []);

  const adminStats = [
    {
      icon: <FaUsers />,
      label: 'Total Students',
      value: stats.totalStudents
    },
    {
      icon: <FaBook />,
      label: 'Active Subscriptions',
      value: stats.activeSubscriptions
    },
    {
      icon: <FaVideo />,
      label: 'Total Videos',
      value: stats.totalVideos
    },
    {
      icon: <FaChartPie />,
      label: 'Total Quizzes',
      value: stats.totalQuizzes
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'subjects':
        return <SubjectManager />;
      case 'videos':
        return <VideoManager />;
      case 'quizzes':
        return <QuizManager />;
      case 'students':
        return <StudentManager />;
      default:
        return <SubjectManager />;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>Manage your e-learning platform</Subtitle>
      </Header>

      <StatsGrid>
        {adminStats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon>{stat.icon}</StatIcon>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </StatCard>
        ))}
      </StatsGrid>

      <AdminNav>
        <NavButton 
          active={activeTab === 'subjects'}
          onClick={() => setActiveTab('subjects')}
        >
          <FaBook /> Subjects
        </NavButton>
        <NavButton 
          active={activeTab === 'videos'}
          onClick={() => setActiveTab('videos')}
        >
          <FaVideo /> Videos
        </NavButton>
        <NavButton 
          active={activeTab === 'quizzes'}
          onClick={() => setActiveTab('quizzes')}
        >
          <FaChartPie /> Quizzes
        </NavButton>
        <NavButton 
          active={activeTab === 'students'}
          onClick={() => setActiveTab('students')}
        >
          <FaUsers /> Students
        </NavButton>
      </AdminNav>

      <ContentSection>
        {renderContent()}
      </ContentSection>
    </DashboardContainer>
  );
}

export default AdminDashboard;