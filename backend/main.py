# main.py - Entry point for FastAPI application
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Initialize FastAPI app
app = FastAPI(
    title="Student Management API",
    description="A simple CRUD API for managing students",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing) to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root endpoint - health check
@app.get("/")
def read_root():
    return {"message": "Student Management API is running!"}

# CREATE - Add a new student
@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """
    Create a new student record
    - Accepts student data (name, email, age, course)
    - Returns the created student with assigned ID
    """
    # Check if email already exists
    db_student = db.query(models.Student).filter(models.Student.email == student.email).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new student instance
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# READ - Get all students
@app.get("/students/", response_model=List[schemas.Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all students with pagination
    - skip: number of records to skip (for pagination)
    - limit: maximum number of records to return
    """
    students = db.query(models.Student).offset(skip).limit(limit).all()
    return students

# READ - Get a specific student by ID
@app.get("/students/{student_id}", response_model=schemas.Student)
def read_student(student_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific student by their ID
    - Returns 404 if student not found
    """
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

# UPDATE - Modify an existing student
@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """
    Update an existing student's information
    - Finds student by ID and updates all fields
    - Returns updated student data
    """
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update all fields
    for field, value in student.dict().items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

# DELETE - Remove a student
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """
    Delete a student by their ID
    - Returns confirmation message
    - Returns 404 if student not found
    """
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}