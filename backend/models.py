# models.py - Database table definitions using SQLAlchemy ORM
from sqlalchemy import Column, Integer, String
from database import Base

class Student(Base):
    """
    Student model representing the students table in PostgreSQL
    
    This class defines the structure of our database table:
    - Each attribute becomes a column in the database
    - SQLAlchemy handles the mapping between Python objects and database rows
    """
    
    # Table name in the database
    __tablename__ = "students"
    
    # Primary key - unique identifier for each student
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Student's full name - required field
    name = Column(String, nullable=False, index=True)
    
    # Email address - must be unique across all students
    email = Column(String, unique=True, nullable=False, index=True)
    
    # Student's age - integer field
    age = Column(Integer, nullable=False)
    
    # Course the student is enrolled in
    course = Column(String, nullable=False)

# Why we use SQLAlchemy ORM:
# 1. Object-Relational Mapping: Work with Python objects instead of raw SQL
# 2. Database abstraction: Same code works with different databases
# 3. Automatic SQL generation: SQLAlchemy creates optimized SQL queries
# 4. Type safety: Python types are mapped to appropriate database types
# 5. Migration support: Easy to modify table structure as app evolves

# Column options explained:
# - primary_key=True: Makes this the unique identifier
# - index=True: Creates database index for faster queries
# - unique=True: Ensures no duplicate values
# - nullable=False: Field is required (NOT NULL in SQL)
# - autoincrement=True: Database automatically assigns next number