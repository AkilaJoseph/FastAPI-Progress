# database.py - Database connection and session management
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection string
# Format: postgresql://username:password@localhost:port/database_name
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0020@localhost:5432/student_management"

# Create database engine
# echo=True will log all SQL statements (useful for debugging)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True  # Set to False in production
)

# Create session factory
# SessionLocal will be used to create database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
Base = declarative_base()

# Purpose of this file:
# 1. Establishes connection to PostgreSQL database
# 2. Creates a session factory for database operations
# 3. Provides base class for all database models
# 4. Centralizes database configuration in one place