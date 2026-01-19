import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowRight,
  FaTrophy,
  FaChartBar,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { supabaseService } from '../../services/supabaseService';
import LockedContent from '../Common/LockedContent';

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const QuizHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h2`
  margin: 0 0 0.5rem 0;
`;

const QuizInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const QuestionContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const QuestionText = styled.h3`
  margin: 0 0 2rem 0;
  color: #333;
  line-height: 1.6;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OptionButton = styled.button`
  background: ${({ selected, correct, wrong }) => 
    wrong ? '#ffebee' : 
    correct ? '#e8f5e9' : 
    selected ? '#f0f7ff' : 
    'white'};
  border: 2px solid ${({ selected, correct, wrong }) => 
    wrong ? '#f44336' : 
    correct ? '#4CAF50' : 
    selected ? '#667eea' : 
    '#eee'};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    background: #f0f7ff;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  background: ${({ primary }) => primary ? '#667eea' : '#f5f5f5'};
  color: ${({ primary }) => primary ? 'white' : '#333'};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: ${({ warning }) => warning ? '#f44336' : '#333'};
`;

const ResultsContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const ResultsInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`;

const ResultItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

function QuizComponent({ quiz, onComplete }) {
  const { hasActiveSubscription, user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 600); // 10 minutes default
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Ensure quiz has questions
  const normalizedQuiz = {
    ...quiz,
    questions: Array.isArray(quiz?.questions) ? quiz.questions : [],
    timeLimit: quiz?.timeLimit || 600,
    passingScore: quiz?.passingScore || 70
  };

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted]);

  if (!hasActiveSubscription()) {
    return (
      <QuizContainer>
        <LockedContent message="Subscribe to access quizzes and exams" />
      </QuizContainer>
    );
  }

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < normalizedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    let correctAnswers = 0;

    normalizedQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        totalScore += question.points || 1;
        correctAnswers++;
      }
    });

    setScore(totalScore);
    setQuizCompleted(true);
    setShowResults(true);

    // Save result to Supabase
    const results = {
      quiz_id: normalizedQuiz.id,
      score: totalScore,
      total_questions: normalizedQuiz.questions.length,
      correct_answers: correctAnswers,
      percentage: Math.round((totalScore / normalizedQuiz.questions.length) * 100),
      passed: Math.round((totalScore / normalizedQuiz.questions.length) * 100) >= normalizedQuiz.passingScore,
      time_spent: (normalizedQuiz.timeLimit || 600) - timeLeft,
      answers: answers
    };

    try {
      if (user) {
        await supabaseService.saveQuizResult({
          ...results,
          user_id: user.id
        });
      }
    } catch (error) {
      console.warn('Failed to save quiz result to database:', error);
      // Fallback to localStorage
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      localStorage.setItem('quizResults', JSON.stringify([...existingResults, {
        ...results,
        quizId: normalizedQuiz.id,
        date: new Date().toISOString()
      }]));
    }

    if (onComplete) {
      onComplete(results);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!normalizedQuiz.questions || normalizedQuiz.questions.length === 0) {
    return (
      <QuizContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No questions available</h3>
          <p>This quiz doesn't have any questions yet.</p>
        </div>
      </QuizContainer>
    );
  }

  const currentQ = normalizedQuiz.questions[currentQuestion];

  if (showResults) {
    const percentage = Math.round((score / normalizedQuiz.questions.length) * 100);
    const isPassed = percentage >= normalizedQuiz.passingScore;

    return (
      <QuizContainer>
        <ResultsContainer>
          <ScoreCircle>
            <ScoreValue>{percentage}%</ScoreValue>
            <ScoreLabel>Your Score</ScoreLabel>
          </ScoreCircle>

          <h3>{isPassed ? 'Congratulations!' : 'Keep Practicing!'}</h3>
          <p>
            {isPassed 
              ? 'You have successfully passed the quiz.'
              : 'You need more practice to pass this quiz.'}
          </p>

          <ResultsInfo>
            <ResultItem>
              <FaCheckCircle style={{ color: '#4CAF50', fontSize: '2rem' }} />
              <h4>Correct</h4>
              <p>{score}/{normalizedQuiz.questions.length}</p>
            </ResultItem>
            <ResultItem>
              <FaChartBar style={{ color: '#667eea', fontSize: '2rem' }} />
              <h4>Percentage</h4>
              <p>{percentage}%</p>
            </ResultItem>
            <ResultItem>
              <FaTrophy style={{ color: '#FF9800', fontSize: '2rem' }} />
              <h4>Status</h4>
              <p>{isPassed ? 'Passed' : 'Failed'}</p>
            </ResultItem>
          </ResultsInfo>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Take Another Quiz
          </button>
        </ResultsContainer>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <QuizHeader>
        <QuizTitle>{normalizedQuiz.title}</QuizTitle>
        <p>{normalizedQuiz.description || ''}</p>
        <QuizInfo>
          <Timer warning={timeLeft < 60}>
            <FaClock /> Time Left: {formatTime(timeLeft)}
          </Timer>
          <div>Questions: {currentQuestion + 1}/{normalizedQuiz.questions.length}</div>
          <div>Passing Score: {normalizedQuiz.passingScore}%</div>
        </QuizInfo>
      </QuizHeader>

      <QuestionContainer>
        <QuestionText>
          Q{currentQuestion + 1}: {currentQ.question}
        </QuestionText>

        <OptionsGrid>
          {currentQ.options && currentQ.options.length > 0 ? (
            currentQ.options.map((option, index) => (
              <OptionButton
                key={index}
                selected={answers[currentQ.id] === index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
              >
                {option}
              </OptionButton>
            ))
          ) : (
            <p>No options available for this question</p>
          )}
        </OptionsGrid>
      </QuestionContainer>

      <Navigation>
        <NavButton
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </NavButton>

        <div>
          Question {currentQuestion + 1} of {normalizedQuiz.questions.length}
        </div>

        <NavButton
          primary
          onClick={handleNext}
        >
          {currentQuestion === normalizedQuiz.questions.length - 1 ? 'Submit' : 'Next'}
          <FaArrowRight />
        </NavButton>
      </Navigation>
    </QuizContainer>
  );
}

export default QuizComponent;