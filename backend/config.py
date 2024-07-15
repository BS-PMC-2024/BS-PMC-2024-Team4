import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    TESTING = False
    MONGO_URI = "mongodb+srv://yovelni:Ecz4680zZqj8OOEv@dogworry.iutobjz.mongodb.net/?retryWrites=true&w=majority&appName=DogWorry"

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = 'mongodb://localhost:27017/testdb'