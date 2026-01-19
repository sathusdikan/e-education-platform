import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { subjectService } from '../../services/subjectService';

const QuizManagerContainer = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
`;

const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #45a049;
  }
`;

const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const QuizCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const QuizTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1rem;
  
  &:hover {
    color: #333;
  }
`;

const QuizInfo = styled.div`
  color: #666;
  
  p {
    margin: 0.5rem 0;
  }
`;

const Form = styled.form`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #dee2e6;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const QuestionCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OptionInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const OptionInputField = styled.input`
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const AddOptionButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const RemoveButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #d32f2f;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  position: sticky;
  bottom: 0;
  background: #f8f9fa;
  padding: 1rem;
  margin: 2rem -2rem -2rem -2rem;
  border-top: 1px solid #dee2e6;
`;

const SubmitButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #45a049;
  }
`;

const CancelButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #d32f2f;
  }
`;

function QuizManager() {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    type: 'practice',
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
      }
    ]
  });

  useEffect(() => {
    loadQuizzes();
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjectsData = await subjectService.getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadQuizzes = async () => {
    try {
      const allQuizzes = [];
      const subjectsData = await subjectService.getSubjects();
      
      for (const subject of subjectsData) {
        const subjectQuizzes = await subjectService.getQuizzesBySubject(subject.id);
        allQuizzes.push(...subjectQuizzes);
      }
      
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      setQuizzes(storedQuizzes);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' || name === 'passingScore' ? parseInt(value) || 0 : value
    }));
  };

  const handleQuestionChange = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 1
        }
      ]
    }));
  };

  const removeQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const addOption = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      )
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId && q.options.length > 2) {
          const newOptions = q.options.filter((_, index) => index !== optionIndex);
          return {
            ...q,
            options: newOptions,
            correctAnswer: q.correctAnswer >= optionIndex && q.correctAnswer > 0 
              ? q.correctAnswer - 1 
              : q.correctAnswer
          };
        }
        return q;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate questions
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.filter(opt => opt.trim()).length < 2) {
        toast.error(`Question ${i + 1} needs at least 2 options`);
        return;
      }
      if (q.options[q.correctAnswer] === undefined || !q.options[q.correctAnswer].trim()) {
        toast.error(`Question ${i + 1} needs a valid correct answer`);
        return;
      }
    }

    try {
      if (editingQuiz) {
        await subjectService.updateQuiz(editingQuiz.id, formData);
        toast.success('Quiz updated successfully!');
      } else {
        await subjectService.createQuiz(formData);
        toast.success('Quiz created successfully!');
      }
      
      loadQuizzes();
      resetForm();
    } catch (error) {
      toast.error('Failed to save quiz: ' + error.message);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title || '',
      description: quiz.description || '',
      subjectId: quiz.subjectId || '',
      type: quiz.type || 'practice',
      timeLimit: quiz.timeLimit || 10,
      passingScore: quiz.passingScore || 70,
      questions: quiz.questions && quiz.questions.length > 0 
        ? quiz.questions 
        : [{
            id: Date.now(),
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 1
          }]
    });
    setShowForm(true);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await subjectService.deleteQuiz(quizId);
        toast.success('Quiz deleted successfully!');
        loadQuizzes();
      } catch (error) {
        toast.error('Failed to delete quiz: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: '',
      type: 'practice',
      timeLimit: 10,
      passingScore: 70,
      questions: [
        {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 1
        }
      ]
    });
    setEditingQuiz(null);
    setShowForm(false);
  };

  return (
    <QuizManagerContainer>
      <Header>
        <Title>Manage Quizzes</Title>
        <AddButton onClick={() => setShowForm(true)}>
          <FaPlus /> Add Quiz
        </AddButton>
      </Header>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>
          
          <FormGroup>
            <FormLabel>Subject *</FormLabel>
            <FormSelect
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Quiz Title *</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Algebra Chapter 1 Quiz"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the quiz"
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <FormLabel>Quiz Type</FormLabel>
              <FormSelect
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="practice">Practice</option>
                <option value="chapter_end">Chapter End</option>
                <option value="final_exam">Final Exam</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel>Time Limit (minutes)</FormLabel>
              <FormInput
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleInputChange}
                min="1"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Passing Score (%)</FormLabel>
              <FormInput
                type="number"
                name="passingScore"
                value={formData.passingScore}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </FormGroup>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <FormLabel style={{ margin: 0 }}>Questions *</FormLabel>
              <AddOptionButton type="button" onClick={addQuestion}>
                <FaPlus /> Add Question
              </AddOptionButton>
            </div>

            {formData.questions.map((question, qIndex) => (
              <QuestionCard key={question.id}>
                <QuestionHeader>
                  <h4>Question {qIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <RemoveButton
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      title="Remove Question"
                    >
                      <FaMinus />
                    </RemoveButton>
                  )}
                </QuestionHeader>

                <FormGroup>
                  <FormLabel>Question Text *</FormLabel>
                  <FormTextarea
                    value={question.question}
                    onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                    placeholder="Enter the question"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Options *</FormLabel>
                  {question.options.map((option, oIndex) => (
                    <OptionInput key={oIndex}>
                      <input
                        type="radio"
                        name={`correct_${question.id}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => handleQuestionChange(question.id, 'correctAnswer', oIndex)}
                        required
                      />
                      <OptionInputField
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(question.id, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <RemoveButton
                          type="button"
                          onClick={() => removeOption(question.id, oIndex)}
                          title="Remove Option"
                        >
                          <FaMinus />
                        </RemoveButton>
                      )}
                    </OptionInput>
                  ))}
                  <AddOptionButton
                    type="button"
                    onClick={() => addOption(question.id)}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <FaPlus /> Add Option
                  </AddOptionButton>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Points</FormLabel>
                  <FormInput
                    type="number"
                    value={question.points || 1}
                    onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </FormGroup>
              </QuestionCard>
            ))}
          </div>

          <FormActions>
            <CancelButton type="button" onClick={resetForm}>
              <FaTimes /> Cancel
            </CancelButton>
            <SubmitButton type="submit">
              <FaSave /> {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </SubmitButton>
          </FormActions>
        </Form>
      )}

      <QuizzesGrid style={{ marginTop: showForm ? '2rem' : '0' }}>
        {quizzes.map(quiz => {
          const subject = subjects.find(s => s.id === quiz.subjectId);
          return (
            <QuizCard key={quiz.id}>
              <QuizHeader>
                <QuizTitle>{quiz.title}</QuizTitle>
                <Actions>
                  <ActionButton onClick={() => handleEdit(quiz)} title="Edit">
                    <FaEdit />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(quiz.id)} title="Delete">
                    <FaTrash />
                  </ActionButton>
                </Actions>
              </QuizHeader>

              <QuizInfo>
                <p>{quiz.description || 'No description'}</p>
                <p><strong>Subject:</strong> {subject?.name || quiz.subject_id || quiz.subjectId || 'N/A'}</p>
                <p><strong>Type:</strong> {quiz.type || 'practice'}</p>
                <p><strong>Questions:</strong> {Array.isArray(quiz.questions) ? quiz.questions.length : 0}</p>
                <p><strong>Time Limit:</strong> {Math.floor((quiz.time_limit || quiz.timeLimit || 600) / 60)} minutes</p>
                <p><strong>Passing Score:</strong> {quiz.passing_score || quiz.passingScore || 70}%</p>
              </QuizInfo>
            </QuizCard>
          );
        })}
      </QuizzesGrid>

      {!showForm && quizzes.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No quizzes found. Click "Add Quiz" to create your first quiz.
        </p>
      )}
    </QuizManagerContainer>
  );
}

export default QuizManager;
