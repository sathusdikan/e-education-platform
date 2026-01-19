import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCalculator,
  FaFlask,
  FaAtom,
  FaBook,
  FaPlayCircle,
  FaChartLine,
  FaCertificate,
  FaUsers,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';
import SubjectCard from '../components/Student/SubjectCard';
import { subjectService } from '../services/subjectService';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  margin: 4rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const SubjectsSection = styled.section`
  margin: 4rem 0;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await subjectService.getSubjects();
        // Map subjects to include icons and additional data for display
        const subjectsWithIcons = fetchedSubjects.map(subject => {
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
            chapters: subject.chapters?.length || 0,
            videos: 0, // Will be calculated from videos table
            quizzes: 0  // Will be calculated from quizzes table
          };
        });
        setSubjects(subjectsWithIcons);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        // Fallback to default subjects if API fails
        setSubjects([
          {
            id: 'math',
            title: 'Mathematics',
            description: 'Master algebra, calculus, geometry and more with interactive lessons.',
            icon: <FaCalculator />,
            color: '#4CAF50',
            chapters: 12,
            videos: 45,
            quizzes: 24
          },
          {
            id: 'chemistry',
            title: 'Chemistry',
            description: 'Explore organic, inorganic and physical chemistry with lab simulations.',
            icon: <FaFlask />,
            color: '#2196F3',
            chapters: 10,
            videos: 38,
            quizzes: 20
          },
          {
            id: 'physics',
            title: 'Physics',
            description: 'Understand mechanics, thermodynamics, electromagnetism and quantum physics.',
            icon: <FaAtom />,
            color: '#FF9800',
            chapters: 15,
            videos: 52,
            quizzes: 28
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const features = [
    {
      icon: <FaPlayCircle />,
      title: 'Video Lectures',
      description: 'High-quality video lessons from expert instructors'
    },
    {
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics'
    },
    {
      icon: <FaCertificate />,
      title: 'Certification',
      description: 'Get certified upon successful course completion'
    },
    {
      icon: <FaUsers />,
      title: 'Community Support',
      description: 'Connect with peers and instructors in discussion forums'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Learn Science & Mathematics Online</HeroTitle>
        <HeroSubtitle>
          Interactive courses in Mathematics, Chemistry, and Physics. 
          Join thousands of students mastering STEM subjects.
        </HeroSubtitle>
        <CTAButton to="/register">
          Start Learning Now <FaArrowRight />
        </CTAButton>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose EduLearn?</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <SubjectsSection>
        <SectionTitle>Our Subjects</SectionTitle>
        <SubjectsGrid>
          {subjects.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              isPreview={true}
            />
          ))}
        </SubjectsGrid>
      </SubjectsSection>
    </HomeContainer>
  );
}

export default Home;