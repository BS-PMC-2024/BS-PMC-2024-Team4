import pytest
from flask import Flask, session, url_for
from app import create_app  # Ensure this import matches your application structure
from unittest.mock import patch
import mongomock

@pytest.fixture
def client():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "WTF_CSRF_ENABLED": False,  # Disable CSRF tokens in the form
    })

    with app.test_client() as client:
        yield client


def test_login_page(client):
    """Test the login page loads correctly."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Login" in response.data  # Check if 'Login' is part of the response

def test_successful_login(client):
    """Test successful login."""
    response = client.post('/', data={
        'email': 'dor@dor.com',
        'password': 'dordordor'
    }, follow_redirects=True)
    print(response.data)  # To see what's actually returned
    assert response.status_code == 200
    assert b"Welcome" in response.data

def test_unsuccessful_login(client):
    """Test login with wrong credentials."""
    response = client.post('/', data={
        'email': 'wrong@example.com',
        'password': 'wrongpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Invalid credentials" in response.data

def test_main_access(client):
    """Test access to the main page."""
    response = client.get('/Main')
    assert response.status_code == 200
    assert b"Welcome" in response.data  # Assuming 'Welcome' text is in your home page

@patch('app.extensions.mongo')
def test_successful_login_with_mock(mock_mongo, client):
    """Test successful login with mocked MongoDB."""
    
    mock_db = mongomock.MongoClient()
    mockk = mock_db.get_database("Users")
    mock_users = mockk.get_collection("admins")
    mock_users.insert_one({"email": "correct@example.com", "password": "correctpassword"})
    mock_mongo.client.get_database.return_value = mock_db

    response = client.post('/', data={
        'email': 'correct@example.com',
        'password': 'correctpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    print(response.data)
    assert b"HomePage" in response.data
