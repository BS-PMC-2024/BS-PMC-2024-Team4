from flask import Flask
from config import Config, TestingConfig
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.extensions import mongo
import mongomock
from flask import Blueprint, render_template, request, redirect, url_for, flash
def create_app(config_class=Config):
    app = Flask(__name__)
    if config_class == 'testing':
        app.config.from_object(TestingConfig)
        app.config['MONGO_URI'] = 'mongodb://localhost:27017/testdb'  # Ensure this is set for consistency
        mongo.db = mongomock.MongoClient().db
    else:
        app.config.from_object(config_class)

    # Initialize Flask extensions here
    mongo.init_app(app)
    
    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.user import bp as user_bp
    app.register_blueprint(user_bp, url_prefix='/user')

    from app.info import bp as info_bp
    app.register_blueprint(info_bp, url_prefix='/info')

    from app.auth import auth as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')


    from app.manager import bp as manager_bp
    app.register_blueprint(manager_bp, url_prefix='/manager')

    from app.lostdogs import ld as ld_bp
    app.register_blueprint(ld_bp, url_prefix='/lostDog')



    from app.manager import bp as manager_bp
    app.register_blueprint(manager_bp, url_prefix='/manager')

    from app.lostdogs import ld as ld_bp
    app.register_blueprint(ld_bp, url_prefix='/lostDog')

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'
    
    return app