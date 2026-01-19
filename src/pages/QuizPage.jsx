import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../components/Student/QuizComponent';
import { subjectService } from '../services/subjectService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await subjectService.getQuizById(quizId);
        
        // Normalize quiz data structure
        const normalizedQuiz = {
          id: quizData.id,
          title: quizData.title,
          description: quizData.description || '',
          type: quizData.type || 'practice',
          timeLimit: quizData.time_limit || quizData.timeLimit || 600,
          passingScore: quizData.passing_score || quizData.passingScore || 70,
          questions: (quizData.questions || []).map((q, index) => ({
            id: q.id || `q${index}`,
            question: q.question,
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correct_answer === 'number' 
              ? q.correct_answer 
              : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0),
            points: q.points || 1
          }))
        };
        
        setQuiz(normalizedQuiz);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!quiz) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Quiz not found</h2>
        <p>The quiz you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <QuizComponent quiz={quiz} />
    </div>
  );
}

export default QuizPage;

