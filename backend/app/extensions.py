from pymongo import MongoClient

class PyMongoClient:
    def __init__(self):
        self.client = None

    def init_app(self, app):
        self.client = MongoClient(app.config['MONGO_URI'])

mongo = PyMongoClient()