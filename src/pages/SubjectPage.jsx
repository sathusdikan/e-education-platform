import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaVideo, 
  FaBook, 
  FaChartLine,
  FaClock,
  FaArrowLeft,
  FaPlayCircle,
  FaCheckCircle,
  FaLock
} from 'react-icons/fa';
import VideoPlayer from '../components/Student/VideoPlayer';
import QuizComponent from '../components/Student/QuizComponent';
import LockedContent from '../components/Common/LockedContent';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { subjectService } from '../services/subjectService';

const SubjectContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SubjectTitle = styled.h1`
  margin: 0 0 0.5rem 0;
`;

const SubjectDescription = styled.p`
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: white;
  border-radius: 4px;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s;
`;

const ContentTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
`;

const TabButton = styled.button`
  background: ${({ active }) => active ? '#667eea' : 'transparent'};
  color: ${({ active }) => active ? 'white' : '#666'};
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${({ active }) => active ? '#5a6fd8' : '#f5f5f5'};
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  min-height: 500px;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const VideoCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const VideoTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const VideoDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.85rem;
`;

const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const QuizCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 1.5rem;
`;

const QuizTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const QuizDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const QuizMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.85rem;
`;

const StartButton = styled.button`
  background: ${({ disabled }) => disabled ? '#ccc' : '#667eea'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  width: 100%;
  transition: background 0.3s;
  
  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
`;

function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { hasActiveSubscription, user } = useAuth();

  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [progress, setProgress] = useState(0);
  const [subject, setSubject] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch subject details
        const subjectData = await subjectService.getSubjectById(subjectId);
        setSubject(subjectData);

        // Fetch videos for this subject
        const videosData = await subjectService.getVideosBySubject(subjectId);
        // Normalize video data structure
        const normalizedVideos = videosData.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          url: v.url || v.youtube_url,
          duration: v.duration || '10:00',
          topic: v.topic || 'General',
          order: v.order || 0
        }));
        setVideos(normalizedVideos);

        // Fetch quizzes for this subject
        const quizzesData = await subjectService.getQuizzesBySubject(subjectId);
        // Normalize quiz data structure
        const normalizedQuizzes = quizzesData.map(q => ({
          id: q.id,
          title: q.title,
          description: q.description || '',
          type: q.type || 'practice',
          timeLimit: q.time_limit || q.timeLimit || 600,
          passingScore: q.passing_score || q.passingScore || 70,
          questions: q.questions || []
        }));
        setQuizzes(normalizedQuizzes);

        // Load user progress if logged in
        if (user) {
          try {
            const userProgress = await subjectService.getProgress(user.id, subjectId);
            const completedVideos = userProgress.filter(p => p.watched).length;
            const totalVideos = normalizedVideos.length;
            const progressPercent = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
            setProgress(progressPercent);
          } catch (progressError) {
            console.warn('Failed to load progress:', progressError);
          }
        }
      } catch (err) {
        console.error('Failed to fetch subject data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectData();
    }
  }, [subjectId, user]);

  if (loading) {
    return (
      <SubjectContainer>
        <LoadingSpinner />
      </SubjectContainer>
    );
  }

  if (error || !subject) {
    return (
      <SubjectContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Subject not found</h2>
          <p>{error || 'The subject you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </SubjectContainer>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'videos':
        if (!hasActiveSubscription()) {
          return <LockedContent message="Subscribe to access video lectures" />;
        }

        if (selectedVideo) {
          const video = videos.find(v => v.id === selectedVideo);
          if (!video) {
            setSelectedVideo(null);
            return null;
          }
          return (
            <VideoPlayer
              videoId={selectedVideo}
              videos={videos}
              subjectId={subjectId}
            />
          );
        }
        
        if (videos.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <FaVideo size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
              <h3>No videos available</h3>
              <p>Videos will appear here once they are added by the admin.</p>
            </div>
          );
        }

        // Group videos by topic
        const videosByTopic = {};
        videos.forEach(video => {
          const topic = video.topic || 'General';
          if (!videosByTopic[topic]) {
            videosByTopic[topic] = [];
          }
          videosByTopic[topic].push(video);
        });

        return (
          <VideosGrid>
            {Object.entries(videosByTopic).map(([topic, topicVideos]) => (
              <div key={topic}>
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>{topic}</h3>
                {topicVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoDescription>{video.description}</VideoDescription>
                    <VideoMeta>
                      <span><FaClock /> {video.duration}</span>
                      <span><FaPlayCircle /> Watch</span>
                    </VideoMeta>
                  </VideoCard>
                ))}
              </div>
            ))}
          </VideosGrid>
        );

      case 'quizzes':
        if (!hasActiveSubscription()) {
          return <LockedContent message="Subscribe to access quizzes and exams" />;
        }

        if (selectedQuiz) {
          const quiz = quizzes.find(q => q.id === selectedQuiz);
          if (!quiz) {
            setSelectedQuiz(null);
            return null;
          }
          
          // Normalize quiz questions format
          const normalizedQuiz = {
            ...quiz,
            questions: quiz.questions.map((q, index) => ({
              id: q.id || `q${index}`,
              question: q.question,
              options: Array.isArray(q.options) ? q.options : [],
              correctAnswer: typeof q.correct_answer === 'number' 
                ? q.correct_answer 
                : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0),
              points: q.points || 1
            }))
          };

          return (
            <QuizComponent
              quiz={normalizedQuiz}
              onComplete={() => setSelectedQuiz(null)}
            />
          );
        }
        
        if (quizzes.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <FaChartLine size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
              <h3>No quizzes available</h3>
              <p>Quizzes will appear here once they are created by the admin.</p>
            </div>
          );
        }

        return (
          <QuizzesGrid>
            {quizzes.map(quiz => (
              <QuizCard key={quiz.id}>
                <QuizTitle>{quiz.title}</QuizTitle>
                <QuizDescription>{quiz.description}</QuizDescription>
                <QuizMeta>
                  <span>Questions: {quiz.questions?.length || 0}</span>
                  <span>Time: {Math.floor(quiz.timeLimit / 60)} min</span>
                </QuizMeta>
                <QuizMeta>
                  <span>Type: {quiz.type}</span>
                  <span>Passing: {quiz.passingScore}%</span>
                </QuizMeta>
                <StartButton
                  onClick={() => setSelectedQuiz(quiz.id)}
                  disabled={!hasActiveSubscription()}
                >
                  Start {quiz.type === 'final_exam' ? 'Final Exam' : 'Quiz'}
                </StartButton>
              </QuizCard>
            ))}
          </QuizzesGrid>
        );

      case 'progress':
        return (
          <div>
            <h3>Your Learning Progress</h3>
            <div style={{ margin: '2rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Overall Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <ProgressBar style={{ background: '#eee' }}>
                <Progress progress={progress} />
              </ProgressBar>
            </div>
            
            <h4>Video Progress</h4>
            <div style={{ marginTop: '1rem' }}>
              <p>Videos Watched: {Math.round((progress / 100) * videos.length)} / {videos.length}</p>
              <p>Quizzes Completed: 0 / {quizzes.length}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SubjectContainer>
      <Header style={{ background: `linear-gradient(135deg, ${subject.color || '#667eea'} 0%, #764ba2 100%)` }}>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription>{subject.description}</SubjectDescription>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>{videos.length} Videos</span>
            <span style={{ marginLeft: '1rem' }}>
              {quizzes.length} Quizzes
            </span>
          </div>
          
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div>Overall Progress</div>
              <ProgressBar>
                <Progress progress={progress} />
              </ProgressBar>
              <span>{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </Header>

      <ContentTabs>
        <TabButton
          active={activeTab === 'videos'}
          onClick={() => {
            setActiveTab('videos');
            setSelectedVideo(null);
          }}
        >
          <FaVideo /> Video Lectures ({videos.length})
        </TabButton>
        
        <TabButton
          active={activeTab === 'quizzes'}
          onClick={() => {
            setActiveTab('quizzes');
            setSelectedQuiz(null);
          }}
        >
          <FaChartLine /> Quizzes & Exams ({quizzes.length})
        </TabButton>
        
        {user && (
          <TabButton
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          >
            <FaChartLine /> Progress
          </TabButton>
        )}
      </ContentTabs>

      <ContentArea>
        {renderContent()}
      </ContentArea>
    </SubjectContainer>
  );
}

export default SubjectPage;
