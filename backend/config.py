import os
from dotenv import load_dotenv

try:
    load_dotenv()
except ImportError:
    print(ImportError)

basedir = os.path.abspath(os.path.dirname(__file__))
mongo_user = os.environ.get('MONGODB_USER', None)
mongo_password = os.environ.get('MONGODB_PASSWORD', None)

class Config:
    TESTING = False
    DEBUG = False
    MONGO_URI = f"mongodb+srv://{mongo_user}:{mongo_password}@dogworry.iutobjz.mongodb.net/?retryWrites=true&w=majority&appName=DogWorry"
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dogWorry')
class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    MONGO_URI = 'mongodb://localhost:27017/testdb'

