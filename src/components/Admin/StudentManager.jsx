import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCalendar, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StudentManagerContainer = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const StudentCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
`;

const StudentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const StudentName = styled.h3`
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const StudentInfo = styled.div`
  color: #666;

  p {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

function StudentManager() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const studentUsers = storedUsers.filter(user => user.role === 'student');
    setStudents(studentUsers);
  };

  const toggleStudentStatus = (studentId) => {
    const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = updatedUsers.findIndex(u => u.id === studentId);

    if (userIndex !== -1) {
      // Toggle active status (assuming there's an active field)
      updatedUsers[userIndex].active = !updatedUsers[userIndex].active;
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadStudents(); // Reload students
      toast.success('Student status updated!');
    }
  };

  return (
    <StudentManagerContainer>
      <Header>
        <Title>Manage Students</Title>
      </Header>

      <StudentsGrid>
        {students.map(student => (
          <StudentCard key={student.id}>
            <StudentHeader>
              <StudentName>
                <FaUser /> {student.name || student.email}
              </StudentName>
              <Actions>
                <ActionButton onClick={() => toggleStudentStatus(student.id)}>
                  {student.active !== false ? <FaToggleOn /> : <FaToggleOff />}
                </ActionButton>
              </Actions>
            </StudentHeader>

            <StudentInfo>
              <p><FaEnvelope /> {student.email}</p>
              <p><FaCalendar /> Joined: {new Date(student.createdAt || Date.now()).toLocaleDateString()}</p>
              <StatusBadge active={student.active !== false}>
                {student.active !== false ? 'Active' : 'Inactive'}
              </StatusBadge>
            </StudentInfo>
          </StudentCard>
        ))}
      </StudentsGrid>

      {students.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No students found.
        </p>
      )}
    </StudentManagerContainer>
  );
}

export default StudentManager;