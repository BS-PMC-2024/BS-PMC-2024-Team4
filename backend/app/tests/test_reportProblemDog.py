import pytest
from flask import Flask, json
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient

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
    db = mock_client['Reports']
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return db

def test_report_problematic_dog_success(mock_mongo, client):
    # Set up the mock collection
    mock_problematic_dogs = mock_mongo['ProblematicDog']

    # Test data
    data = {
        'dog_breed': 'Labrador',
        'issue_description': 'Aggressive behavior',
        'dog_color': 'Black',
        'latitude': 40.7128,
        'longitude': -74.0060
    }

    # Call the API
    response = client.post('user/reportProblematicDog', json=data)
    
    # Assertions
    assert response.status_code == 200
    assert response.json['success'] is True
    assert response.json['message'] == 'Problematic dog reported successfully'
    assert mock_problematic_dogs.find_one(data) is not None

def test_report_problematic_dog_missing_fields(mock_mongo, client):
    # Test data with missing fields
    data = {
        'dog_breed': 'Labrador',
        # 'issue_description': 'Aggressive behavior',  # Missing field
        'dog_color': 'Black',
        'latitude': 40.7128,
        'longitude': -74.0060
    }

    # Call the API
    response = client.post('user/reportProblematicDog', json=data)
    
    # Assertions
    assert response.status_code == 400
    assert response.json['success'] is False
    assert response.json['error'] == 'All fields are required'

def test_report_problematic_dog_exception(mock_mongo, client):
    mock_problematic_dogs = mock_mongo['ProblematicDog']
    
    data = {
        'dog_breed': 'Bulldog',
        'issue_description': 'Aggressive behavior',
        'dog_color': 'Brown',
        'latitude': 40.7128,
        'longitude': -74.0060
    }

    # Mock insert_one to raise an exception
    def mock_insert_one(data):
        raise Exception('Insert failed')

    mock_problematic_dogs.insert_one = mock_insert_one

    # Call the API
    response = client.post('user/reportProblematicDog', json=data)

    # Assertions
    assert response.status_code == 500
    assert response.json['success'] is False
    assert response.json['error'] == 'Failed to report problematic dog'
