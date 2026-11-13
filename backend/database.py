import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models import Base

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')
os.makedirs(DB_DIR, exist_ok=True)

DB_PATH = os.path.join(DB_DIR, 'rythusahayam.db')
raw_db_url = os.environ.get('DATABASE_URL')

if raw_db_url:
    # Render and Heroku use postgres://, SQLAlchemy 1.4+ requires postgresql://
    if raw_db_url.startswith('postgres://'):
        DATABASE_URI = raw_db_url.replace('postgres://', 'postgresql://', 1)
    else:
        DATABASE_URI = raw_db_url
    connect_args = {}
else:
    DATABASE_URI = f'sqlite:///{DB_PATH}'
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URI, echo=False, connect_args=connect_args)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
