import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaCheckCircle, FaLock } from 'react-icons/fa';

const Card = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.15);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  padding: 2rem;
  color: white;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
`;

const CardBody = styled.div`
  padding: 2rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color};
  border-radius: 4px;
  width: ${props => props.progress || 0}%;
  transition: width 0.3s;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.color || props.disabled ? '#ccc' : props.color};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background: ${props => props.disabled ? '#ccc' : (props.color + 'dd')};
  }
`;

const LockedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffebee;
  color: #f44336;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

function SubjectCard({ subject, isPreview = false, showProgress = false }) {
  const { id, title, description, icon, color, chapters, videos, quizzes, progress = 0, isLocked = false, completedVideos = 0, totalVideos = 0 } = subject;

  return (
    <Card>
      <CardHeader color={color}>
        <IconWrapper>{icon}</IconWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardBody>
        <Description>{description}</Description>

        {isLocked && (
          <LockedBadge>
            <FaLock /> Subscription Required
          </LockedBadge>
        )}

        {showProgress && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Progress</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: color }}>
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar>
              <ProgressFill color={color} progress={progress} />
            </ProgressBar>
            {totalVideos > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                {completedVideos} of {totalVideos} videos completed
              </div>
            )}
          </div>
        )}

        <Stats>
          <Stat>
            <StatNumber color={color}>{chapters || subject.chapters?.length || 0}</StatNumber>
            <StatLabel>Chapters</StatLabel>
          </Stat>
          <Stat>
            <StatNumber color={color}>{videos || totalVideos || 0}</StatNumber>
            <StatLabel>Videos</StatLabel>
          </Stat>
          <Stat>
            <StatNumber color={color}>{quizzes || 0}</StatNumber>
            <StatLabel>Quizzes</StatLabel>
          </Stat>
        </Stats>

        {isLocked ? (
          <ActionButton to="/pricing" disabled={true} color={color}>
            <FaLock /> Subscribe to Access
          </ActionButton>
        ) : isPreview ? (
          <ActionButton to={`/subject/${id}`} color={color}>
            <FaPlay /> Start Learning
          </ActionButton>
        ) : (
          <ActionButton to={`/subject/${id}`} color={color}>
            <FaCheckCircle /> Continue
          </ActionButton>
        )}
      </CardBody>

    </Card>
  );
}

export default SubjectCard;