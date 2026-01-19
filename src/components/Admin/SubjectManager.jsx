import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const SubjectManagerContainer = styled.div``;

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

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SubjectCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
`;

const SubjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const SubjectTitle = styled.h3`
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

const SubjectInfo = styled.div`
  color: #666;
  margin-bottom: 1rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const StatusBadge = styled.span`
  background: ${({ active }) => active ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const Form = styled.form`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
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

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    color: '#667eea',
    isActive: true,
    chapters: []
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    // Ensure all subjects have required fields with defaults
    const normalizedSubjects = storedSubjects.map(subject => ({
      ...subject,
      chapters: Array.isArray(subject.chapters) ? subject.chapters : [],
      isActive: subject.isActive !== false,
      enabled: subject.enabled !== false
    }));
    setSubjects(normalizedSubjects);
  };

  const saveSubjects = (subjectsList) => {
    localStorage.setItem('subjects', JSON.stringify(subjectsList));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let updatedSubjects;
    
    if (editingSubject) {
      // Update existing subject
      updatedSubjects = subjects.map(subject =>
        subject.id === editingSubject.id ? formData : subject
      );
      toast.success('Subject updated successfully!');
    } else {
      // Add new subject
      const newSubject = {
        ...formData,
        id: `subject_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      updatedSubjects = [...subjects, newSubject];
      toast.success('Subject added successfully!');
    }
    
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    resetForm();
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData(subject);
    setShowForm(true);
  };

  const handleDelete = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      setSubjects(updatedSubjects);
      saveSubjects(updatedSubjects);
      toast.success('Subject deleted successfully!');
    }
  };

  const toggleSubjectStatus = (subjectId) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId 
        ? { 
            ...subject, 
            isActive: subject.isActive === false ? true : false,
            enabled: subject.enabled === false ? true : false
          }
        : subject
    );
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    toast.success('Subject status updated!');
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      color: '#667eea',
      isActive: true,
      chapters: []
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  const predefinedSubjects = [
    {
      id: 'math',
      name: 'Mathematics',
      description: 'Algebra, Calculus, Geometry, Statistics',
      color: '#4CAF50',
      isActive: true,
      chapters: ['Algebra', 'Calculus', 'Geometry', 'Statistics']
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      description: 'Organic, Inorganic, Physical Chemistry',
      color: '#2196F3',
      isActive: true,
      chapters: ['Basics', 'Organic', 'Inorganic', 'Physical']
    },
    {
      id: 'physics',
      name: 'Physics',
      description: 'Mechanics, Thermodynamics, Electromagnetism',
      color: '#FF9800',
      isActive: true,
      chapters: ['Mechanics', 'Thermodynamics', 'Waves', 'Modern Physics']
    }
  ];

  const initializeSubjects = () => {
    if (subjects.length === 0) {
      setSubjects(predefinedSubjects);
      saveSubjects(predefinedSubjects);
      toast.success('Default subjects initialized!');
    }
  };

  return (
    <SubjectManagerContainer>
      <Header>
        <Title>Manage Subjects</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => setShowForm(true)}>
            <FaPlus /> Add Subject
          </AddButton>
          <button 
            onClick={initializeSubjects}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Initialize Default Subjects
          </button>
        </div>
      </Header>

      <SubjectsGrid>
        {subjects.map(subject => (
          <SubjectCard key={subject.id}>
            <SubjectHeader>
              <SubjectTitle style={{ color: subject.color }}>
                {subject.name}
              </SubjectTitle>
              <Actions>
                <ActionButton onClick={() => toggleSubjectStatus(subject.id)}>
                  {subject.isActive ? <FaToggleOn /> : <FaToggleOff />}
                </ActionButton>
                <ActionButton onClick={() => handleEdit(subject)}>
                  <FaEdit />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(subject.id)}>
                  <FaTrash />
                </ActionButton>
              </Actions>
            </SubjectHeader>
            
            <SubjectInfo>
              <p>{subject.description}</p>
              <p>
                <strong>Chapters:</strong> {subject.chapters && Array.isArray(subject.chapters) 
                  ? subject.chapters.join(', ') 
                  : 'No chapters added'}
              </p>
              <StatusBadge active={subject.isActive !== false && subject.enabled !== false}>
                {subject.isActive !== false && subject.enabled !== false ? 'Active' : 'Inactive'}
              </StatusBadge>
            </SubjectInfo>
          </SubjectCard>
        ))}
      </SubjectsGrid>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
          
          <FormGroup>
            <FormLabel>Subject Name</FormLabel>
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter subject name"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter subject description"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Color</FormLabel>
            <FormInput
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              {' '}Active
            </label>
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={resetForm}>
              <FaTimes /> Cancel
            </CancelButton>
            <SubmitButton type="submit">
              <FaSave /> {editingSubject ? 'Update' : 'Save'}
            </SubmitButton>
          </FormActions>
        </Form>
      )}
    </SubjectManagerContainer>
  );
}

export default SubjectManager;