// StudentForm.jsx - Form component for creating and editing students
import React, { useState, useEffect } from 'react';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  // Form state - manages input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: ''
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Populate form when editing a student
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        age: student.age?.toString() || '',
        course: student.course || ''
      });
    } else {
      // Reset form for new student
      setFormData({
        name: '',
        email: '',
        age: '',
        course: ''
      });
    }
    setValidationErrors({});
  }, [student]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Age validation
    const age = parseInt(formData.age);
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (isNaN(age) || age < 16 || age > 100) {
      errors.age = 'Age must be between 16 and 100';
    }
    
    // Course validation
    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      age: parseInt(formData.age),
      course: formData.course.trim()
    };
    
    try {
      const success = await onSubmit(submitData);
      if (success) {
        // Reset form only if creating new student
        if (!student) {
          setFormData({
            name: '',
            email: '',
            age: '',
            course: ''
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      course: ''
    });
    setValidationErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      {/* Name field */}
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={validationErrors.name ? 'error' : ''}
          placeholder="Enter student's full name"
          disabled={isSubmitting}
        />
        {validationErrors.name && (
          <span className="error-text">{validationErrors.name}</span>
        )}
      </div>

      {/* Email field */}
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={validationErrors.email ? 'error' : ''}
          placeholder="Enter email address"
          disabled={isSubmitting}
        />
        {validationErrors.email && (
          <span className="error-text">{validationErrors.email}</span>
        )}
      </div>

      {/* Age field */}
      <div className="form-group">
        <label htmlFor="age">Age *</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className={validationErrors.age ? 'error' : ''}
          placeholder="Enter age"
          min="16"
          max="100"
          disabled={isSubmitting}
        />
        {validationErrors.age && (
          <span className="error-text">{validationErrors.age}</span>
        )}
      </div>

      {/* Course field */}
      <div className="form-group">
        <label htmlFor="course">Course *</label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={validationErrors.course ? 'error' : ''}
          disabled={isSubmitting}
        >
          <option value="">Select a course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Data Science">Data Science</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="AI/Machine Learning">AI/Machine Learning</option>
          <option value="Database Administration">Database Administration</option>
        </select>
        {validationErrors.course && (
          <span className="error-text">{validationErrors.course}</span>
        )}
      </div>

      {/* Form buttons */}
      <div className="form-buttons">
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
        </button>
        
        {student && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;

// Component features:
// 1. Controlled Components: All inputs are controlled by React state
// 2. Validation: Both client-side validation and server error handling
// 3. Reusability: Same form for both create and edit operations
// 4. User Experience: Loading states, error messages, and clear feedback
// 5. Accessibility: Proper labels, form structure, and keyboard navigation