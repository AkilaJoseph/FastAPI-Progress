// App.jsx - Main React application component
import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import './App.css';

// API base URL - FastAPI backend
const API_URL = 'http://localhost:8000';

function App() {
  // State management for students and UI
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all students from the API
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/students/`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Error loading students: ' + err.message);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new student
  const createStudent = async (studentData) => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create student');
      }
      
      const newStudent = await response.json();
      setStudents([...students, newStudent]);
      return true; // Success
    } catch (err) {
      setError('Error creating student: ' + err.message);
      console.error('Error creating student:', err);
      return false; // Failure
    }
  };

  // Update an existing student
  const updateStudent = async (id, studentData) => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update student');
      }
      
      const updatedStudent = await response.json();
      setStudents(students.map(s => s.id === id ? updatedStudent : s));
      setEditingStudent(null);
      return true; // Success
    } catch (err) {
      setError('Error updating student: ' + err.message);
      console.error('Error updating student:', err);
      return false; // Failure
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    setError('');
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      setError('Error deleting student: ' + err.message);
      console.error('Error deleting student:', err);
    }
  };

  // Load students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Student Management System</h1>
        <p>A full-stack CRUD application with FastAPI and React</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="app-content">
          {/* Left side - Form */}
          <div className="form-section">
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <StudentForm
              student={editingStudent}
              onSubmit={editingStudent ? 
                (data) => updateStudent(editingStudent.id, data) : 
                createStudent
              }
              onCancel={() => setEditingStudent(null)}
            />
          </div>

          {/* Right side - Student List */}
          <div className="list-section">
            <h2>Students ({students.length})</h2>
            {loading ? (
              <div className="loading">Loading students...</div>
            ) : (
              <StudentList
                students={students}
                onEdit={setEditingStudent}
                onDelete={deleteStudent}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

// Component explanation:
// 1. State Management: Uses React hooks to manage students, editing state, loading, and errors
// 2. API Communication: Implements all CRUD operations using fetch API
// 3. Error Handling: Catches and displays errors from API calls
// 4. User Experience: Loading states, confirmations, and clear feedback
// 5. Component Structure: Separates form and list into reusable components