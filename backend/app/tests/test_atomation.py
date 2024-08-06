import pytest
from flask import Flask
import json
#from unittest.mock import patch
import requests
from unittest.mock import mock_open, patch
from app.atomation.routes import ld

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(ld, url_prefix='/temperature')  # Adjust the URL prefix as needed
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('requests.post')
def test_login(mock_post, client):
    mock_response = {
        "data": {
            "token": "mock_token",
            "refresh_token": "mock_refresh_token"
        }
    }
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = mock_response

    response = client.get('/temperature/auth/login')
    assert response.status_code == 200
    assert b"Hello" in response.data


    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = mock_response

    response = client.get('/temperature/auth/token')
    assert response.status_code == 200
    assert b"Hello" in response.data

@patch('builtins.open', new_callable=mock_open, read_data='{"token": "mock_token", "refresh_Token": "mock_refresh_token"}')
def test_data_file(mock_open, client):
    response = client.get('/temperature/data')
    assert response.status_code == 200
    assert json.loads(response.data) == {"token": "mock_token", "refresh_Token": "mock_refresh_token"}

@patch('builtins.open', new_callable=mock_open, read_data='{"data": {"readings_data": [{"Temperature": 23.45}]}}')
def test_token_file(mock_open, client):
    response = client.get('/temperature/token')
    assert response.status_code == 200
    assert json.loads(response.data) == [23.45]


def test_getAuthToken(client, mocker):
    # Mock the dataFile function to return predefined data
    mocker.patch('app.atomation.routes.dataFile', return_value={
        'token': 'dummy_token',
        'refresh_Token': 'dummy_refresh_token'
    })

    # Mock the requests.post method
    mock_post = mocker.patch('requests.post')
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        'data': {
            'token': 'new_dummy_token',
            'refresh_token': 'new_dummy_refresh_token'
        }
    }
    mock_post.return_value = mock_response

    response = client.get('/temperature/auth/token')
    assert response.status_code == 200
    assert b"Hello" in response.data

    # Verify the new token data is written to data.json
    with open('data.json', 'r') as token_file:
        token_data = json.load(token_file)
    
    assert token_data['token'] == 'new_dummy_token'
    assert token_data['refresh_Token'] == 'new_dummy_refresh_token'


