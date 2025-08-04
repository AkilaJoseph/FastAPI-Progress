// StudentList.jsx - Component to display and manage list of students
import React from 'react';

const StudentList = ({ students, onEdit, onDelete }) => {
  // Handle empty state
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>No students found</h3>
        <p>Add your first student using the form on the left.</p>
      </div>
    );
  }

  return (
    <div className="student-list">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onEdit={() => onEdit(student)}
          onDelete={() => onDelete(student.id)}
        />
      ))}
    </div>
  );
};

// Individual student card component
const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <div className="student-card">
      {/* Student info */}
      <div className="student-info">
        <div className="student-header">
          <h3 className="student-name">{student.name}</h3>
          <span className="student-id">ID: {student.id}</span>
        </div>
        
        <div className="student-details">
          <div className="detail-item">
            <span className="detail-label">📧 Email:</span>
            <span className="detail-value">{student.email}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">🎂 Age:</span>
            <span className="detail-value">{student.age} years old</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">📖 Course:</span>
            <span className="detail-value course-badge">{student.course}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="student-actions">
        <button
          className="edit-btn"
          onClick={onEdit}
          title="Edit student"
        >
          ✏️ Edit
        </button>
        
        <button
          className="delete-btn"
          onClick={onDelete}
          title="Delete student"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default StudentList;

// Component features:
// 1. List Rendering: Maps through students array to create individual cards
// 2. Empty State: Shows friendly message when no students exist
// 3. Card Layout: Clean, organized display of student information
// 4. Action Buttons: Edit and delete functionality with clear visual cues
// 5. Responsive Design: Cards adapt to different screen sizes
// 6. Component Separation: StudentCard is separate for better organization

// Props explanation:
// - students: Array of student objects from the API
// - onEdit: Function called when edit button is clicked
// - onDelete: Function called when delete button is clicked

// Key prop: React requires unique key