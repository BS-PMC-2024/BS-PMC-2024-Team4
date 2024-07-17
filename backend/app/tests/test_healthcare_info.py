# tests/test_user_details.py
import pytest
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import base64
import json

user_data = {
    'user_id': 'test1',
    'first_name': 'Foo',
    'last_name': 'Bar',
    'email': 'FooBar@example.com',
    'phone_number': '1234567890',
    'avatar': b'avatar_data'
}

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

# Test fetching existing user details
def test_get_user_details(client, mock_mongo):
    user_collection = mock_mongo['user-details']
    user_collection.insert_one(user_data)

    response = client.post('/user/getUserDetails/', json={'uid': user_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['first_name'] == 'Foo', f"Expected first_name to be 'Foo' but got {data['first_name']}"
    assert data['last_name'] == 'Bar', f"Expected last_name to be 'Bar' but got {data['last_name']}"
    assert data['email'] == 'FooBar@example.com', f"Expected email to be 'FooBar@example.com' but got {data['email']}"
    assert data['phone_number'] == '1234567890', f"Expected phone_number to be '1234567890' but got {data['phone_number']}"

# Test fetching a user that does not exist
def test_get_non_existing_user_details(client, mock_mongo):
    user_collection = mock_mongo['user-details']

    response = client.post('/user/getUserDetails/', json={'uid': "I_DONT_EXIST"})
    assert response.status_code == 203

# Test saving details for new users
def test_save_user_details_new_user(client, mock_mongo):
    user_collection = mock_mongo['user-details']

    new_user_data = {
        'user_id': 'test2',
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'phone_number': '1234567890',
        'avatar': base64.b64encode(user_data['avatar']).decode('utf-8')
    }

    response = client.post('/user/saveUserDetails', json=new_user_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    response = client.post('/user/getUserDetails/', json={'uid': new_user_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['first_name'] == 'John', f"Expected first_name to be 'John' but got {data['first_name']}"
    assert data['last_name'] == 'Doe', f"Expected last_name to be 'Doe' but got {data['last_name']}"
    assert data['email'] == 'john@example.com', f"Expected email to be 'john@example.com' but got {data['email']}"
    assert data['phone_number'] == '1234567890', f"Expected phone_number to be '1234567890' but got {data['phone_number']}"

# Test editing details for existing users
def test_save_user_details_existing_user(client, mock_mongo):
    user_collection = mock_mongo['user-details']
    user_collection.insert_one(user_data)

    existing_user_data = {
        'user_id': 'test1',
        'first_name': 'Bar',
        'last_name': 'Foo',
        'email': 'BarFoo@example.com',
        'phone_number': '0987654321',
        'avatar': base64.b64encode(user_data['avatar']).decode('utf-8')
    }

    response = client.post('/user/saveUserDetails', json=existing_user_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    response = client.post('/user/getUserDetails/', json={'uid': existing_user_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['first_name'] == 'Bar', f"Expected first_name to be 'Bar' but got {data['first_name']}"
    assert data['last_name'] == 'Foo', f"Expected last_name to be 'Foo' but got {data['last_name']}"
    assert data['email'] == 'BarFoo@example.com', f"Expected email to be 'BarFoo@example.com' but got {data['email']}"
    assert data['phone_number'] == '0987654321', f"Expected phone_number to be '0987654321' but got {data['phone_number']}"

# Test unique emails for users when saving details accross all users
def test_save_user_details_email_taken(client, mock_mongo):
    user_collection = mock_mongo['user-details']
    user_collection.insert_one(user_data)

    new_user_data = {
        'user_id': 'test3',
        'first_name': 'Lorem',
        'last_name': 'Ipsom',
        'email': 'FooBar@example.com',
        'phone_number': '1234567890',
        'avatar': base64.b64encode(user_data['avatar']).decode('utf-8')
    }

    response = client.post('/user/saveUserDetails', json=new_user_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is False, "Expected server response 'success' to be False but got True"
    assert 'error' in data, "Expected 'error' key in response data but it was not found"
