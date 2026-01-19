import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import {
  FaBook,
  FaVideo,
  FaChartBar,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLock,
  FaPlayCircle,
  FaCalculator,
  FaFlask,
  FaAtom,
  FaSpinner
} from 'react-icons/fa';
import SubjectCard from './SubjectCard';
import PaymentModal from './PaymentModal';
import LockedContent from '../Common/LockedContent';
import { subjectService } from '../../services/subjectService';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  margin-bottom: 0.5rem;
`;

const SubscriptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubscriptionStatus = styled.div`
  background: ${({ active }) => active ? '#4CAF50' : '#f44336'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RenewButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    opacity: 0.9;
  }
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
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const SubjectsSection = styled.section`
  margin: 3rem 0;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f5f5f5;
  border-radius: 10px;
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

function StudentDashboard() {
  const { user, hasActiveSubscription, loading: authLoading } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [progress, setProgress] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch data if user is not loaded yet
    if (authLoading || !user) {
      return;
    }

    const fetchData = async () => {
      try {
        // Load user progress from localStorage or API
        const storedProgress = localStorage.getItem(`progress_${user.id}`);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }

        // Fetch subjects from API
        const fetchedSubjects = await subjectService.getSubjects();
        const subjectsWithProgress = fetchedSubjects.map(subject => {
          let icon, color;
          switch (subject.id) {
            case 'math':
              icon = <FaCalculator />;
              color = '#4CAF50';
              break;
            case 'chemistry':
              icon = <FaFlask />;
              color = '#2196F3';
              break;
            case 'physics':
              icon = <FaAtom />;
              color = '#FF9800';
              break;
            default:
              icon = <FaBook />;
              color = '#667eea';
          }

          return {
            ...subject,
            title: subject.name,
            icon,
            color,
            progress: progress[subject.id] || 0,
            totalVideos: 45, // Default values, can be fetched from videos table
            completedVideos: Math.floor((progress[subject.id] || 0) * 45),
            nextLesson: 'Next Lesson', // Can be calculated from progress
            isLocked: !hasActiveSubscription()
          };
        });
        setSubjects(subjectsWithProgress);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        // Fallback to default subjects if API fails
        setSubjects([
          {
            id: 'math',
            title: 'Mathematics',
            description: 'Master algebra, calculus, geometry and more.',
            icon: <FaCalculator />,
            color: '#4CAF50',
            progress: progress.math || 0,
            totalVideos: 45,
            completedVideos: Math.floor((progress.math || 0) * 0.45),
            nextLesson: 'Calculus - Derivatives',
            isLocked: !hasActiveSubscription()
          },
          {
            id: 'chemistry',
            title: 'Chemistry',
            description: 'Explore organic, inorganic and physical chemistry.',
            icon: <FaFlask />,
            color: '#2196F3',
            progress: progress.chemistry || 0,
            totalVideos: 38,
            completedVideos: Math.floor((progress.chemistry || 0) * 0.38),
            nextLesson: 'Organic Reactions',
            isLocked: !hasActiveSubscription()
          },
          {
            id: 'physics',
            title: 'Physics',
            description: 'Understand mechanics, thermodynamics, and more.',
            icon: <FaAtom />,
            color: '#FF9800',
            progress: progress.physics || 0,
            totalVideos: 52,
            completedVideos: Math.floor((progress.physics || 0) * 0.52),
            nextLesson: 'Quantum Mechanics',
            isLocked: !hasActiveSubscription()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, hasActiveSubscription, authLoading]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <FaSpinner style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
          <p>Loading...</p>
        </div>
      </DashboardContainer>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Please log in to access your dashboard</h2>
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Go to Login
          </Link>
        </div>
      </DashboardContainer>
    );
  }

  const stats = [
    {
      icon: <FaBook />,
      label: 'Courses Enrolled',
      value: subjects.length.toString()
    },
    {
      icon: <FaVideo />,
      label: 'Videos Watched',
      value: subjects.reduce((sum, sub) => sum + sub.completedVideos, 0).toString()
    },
    {
      icon: <FaChartBar />,
      label: 'Average Score',
      value: '85%'
    },
    {
      icon: <FaCalendarAlt />,
      label: 'Learning Streak',
      value: '7 days'
    }
  ];

  if (!hasActiveSubscription()) {
    return (
      <DashboardContainer>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, {user.name}!</WelcomeTitle>
          <p>Upgrade your subscription to unlock all features</p>
          <SubscriptionInfo>
            <SubscriptionStatus active={false}>
              <FaExclamationTriangle /> Subscription Inactive
            </SubscriptionStatus>
            <RenewButton onClick={() => setShowPaymentModal(true)}>
              Subscribe Now
            </RenewButton>
          </SubscriptionInfo>
        </WelcomeSection>

        <LockedContent />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user.name}!</WelcomeTitle>
        <p>Continue your learning journey</p>
        <SubscriptionInfo>
          <SubscriptionStatus active={true}>
            <FaCheckCircle /> Subscription Active
          </SubscriptionStatus>
          <p>Expires on: {new Date(user.subscription?.expiry).toLocaleDateString()}</p>
        </SubscriptionInfo>
      </WelcomeSection>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon>{stat.icon}</StatIcon>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </StatCard>
        ))}
      </StatsGrid>

      <SubjectsSection>
        <SectionTitle>Your Subjects</SectionTitle>
        {subjects.length > 0 ? (
          <SubjectsGrid>
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                showProgress={true}
              />
            ))}
          </SubjectsGrid>
        ) : (
          <EmptyState>
            <h3>No subjects enrolled</h3>
            <p>Browse our catalog and start learning!</p>
            <Link to="/">Explore Subjects</Link>
          </EmptyState>
        )}
      </SubjectsSection>

      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </DashboardContainer>
  );
}

export default StudentDashboard;