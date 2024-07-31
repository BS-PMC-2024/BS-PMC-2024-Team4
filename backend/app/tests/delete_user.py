import pytest
from flask import Flask
from app import create_app, mongo
from unittest.mock import patch
import mongomock
from mongomock import MongoClient as MockMongoClient
import json


@pytest.fixture
def app():
    app = create_app()
    app.config.from_object('config.TestingConfig')
    mongo.set_client(MockMongoClient())
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_mongo():
    mock_client = MockMongoClient()
    db = mock_client['Users']
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return db
   
def test_delete_user_success(mock_mongo, client):
    # Setup mock for users collection
    mock_users = mock_mongo['user-details']
    mock_users.insert_one({'user_id': 'user123', 'email': 'test@example.com'}) 
    # Call delete user API
    response = client.delete('/manager/deleteUser', query_string={'user_id': 'user123'})
    print("helloooooooooo", list(mock_users.find()))
    print("Response data:", response.data.decode('utf-8'))
    # Assertions
    assert response.status_code == 200
    assert response.json == {'message': 'User deleted successfully'}
    assert mock_users.find_one({'user_id': 'user123'}) is None

def test_delete_user_not_found(mock_mongo, client):
    # Setup mock for users collection
    mock_users = mock_mongo['user-details']

    # Call delete user API
    response = client.delete('/manager/deleteUser/user456')

    # Assertions
    assert response.status_code == 404
    assert response.json == {'message': 'User not found'}