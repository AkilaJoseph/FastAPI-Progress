# schemas.py - Pydantic models for data validation and serialization
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentBase(BaseModel):
    """
    Base schema with common student fields
    - Contains fields that are shared between create and response schemas
    - Acts as a parent class to avoid code duplication
    """
    name: str = Field(..., min_length=1, max_length=100, description="Student's full name")
    email: EmailStr = Field(..., description="Student's email address")
    age: int = Field(..., ge=16, le=100, description="Student's age (16-100)")
    course: str = Field(..., min_length=1, max_length=100, description="Course name")

class StudentCreate(StudentBase):
    """
    Schema for creating a new student
    - Used when client sends data to create a student
    - Inherits all fields from StudentBase
    - No ID field because database auto-generates it
    """
    pass  # All fields inherited from StudentBase

class Student(StudentBase):
    """
    Schema for returning student data
    - Used when API sends student data back to client
    - Includes the database-generated ID
    - Configured to work with SQLAlchemy models
    """
    id: int = Field(..., description="Unique student identifier")
    
    class Config:
        # Allows Pydantic to work with SQLAlchemy models
        # Enables conversion from database objects to Pydantic models
        from_attributes = True

# Purpose of Pydantic schemas:
# 1. Data Validation: Ensures incoming data meets requirements
# 2. Type Safety: Catches type errors before they reach the database
# 3. Documentation: Auto-generates API documentation with field descriptions
# 4. Serialization: Converts between Python objects and JSON
# 5. IDE Support: Provides autocomplete and type hints

# Field validation options:
# - EmailStr: Validates email format automatically
# - Field(...): Required field (ellipsis means required)
# - min_length/max_length: String length validation
# - ge/le: Greater/less than or equal (for numbers)
# - description: Shows in API documentation

# Schema usage flow:
# 1. Client sends JSON data
# 2. FastAPI uses StudentCreate to validate incoming data
# 3. Valid data is passed to database operations
# 4. Database returns SQLAlchemy model
# 5. FastAPI uses Student schema to serialize response
# 6. Client receives validated JSON response