import pytest
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import base64
import json
from bson import json_util

dog_data = {
    'user_id': 'test1',
    'dog_name': 'Buddy',
    'dog_breed': 'Golden Retriever',
    'dog_age': '3',
    'dog_image': b'dog_image_data'
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
    db = mock_client['Dogs']
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return db

# Test fetching existing user dogs
def test_get_user_dogs(client, mock_mongo):
    user_collection = mock_mongo['user-dogs']
    user_collection.insert_one(dog_data)

    response = client.post('/user/getUserDogs', json={'uid': dog_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data[0]['dog_name'] == 'Buddy', f"Expected dog_name to be 'Buddy' but got {data[0]['dog_name']}"
    assert data[0]['dog_breed'] == 'Golden Retriever', f"Expected dog_breed to be 'Golden Retriever' but got {data[0]['dog_breed']}"
    assert data[0]['dog_age'] == '3', f"Expected dog_age to be '3' but got {data[0]['dog_age']}"

# Test fetching a user that does not exist
def test_get_non_existing_user_dogs(client, mock_mongo):
    dog_collection = mock_mongo['user-dogs']

    response = client.post('/user/getUserDogs', json={'uid': "I_DONT_EXIST"})
    assert response.status_code == 204

# Test adding a new dog for a user
def test_add_dog(client, mock_mongo):
    dog_collection = mock_mongo['user-dogs']

    new_dog_data = {
        'user_id': 'test2',
        'dog_name': 'Charlie',
        'dog_breed': 'Beagle',
        'dog_age': '2',
        'dog_image': base64.b64encode(dog_data['dog_image']).decode('utf-8')
    }

    response = client.post('/user/addDog', json=new_dog_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    response = client.post('/user/getUserDogs', json={'uid': new_dog_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data[0]['dog_name'] == 'Charlie', f"Expected dog_name to be 'Charlie' but got {data[0]['dog_name']}"
    assert data[0]['dog_breed'] == 'Beagle', f"Expected dog_breed to be 'Beagle' but got {data[0]['dog_breed']}"
    assert data[0]['dog_age'] == '2', f"Expected dog_age to be '2' but got {data[0]['dog_age']}"

# Test adding an existing dog for a user
def test_add_existing_dog(client, mock_mongo):
    dog_collection = mock_mongo['user-dogs']
    dog_collection.insert_one(dog_data)

    existing_dog_data = {
        'user_id': 'test1',
        'dog_name': 'Buddy',
        'dog_breed': 'Golden Retriever',
        'dog_age': '3',
        'dog_image': base64.b64encode(dog_data['dog_image']).decode('utf-8')
    }

    response = client.post('/user/addDog', json=existing_dog_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is False, "Expected success to be False but got True"
    assert 'exist' in data, "Expected 'exist' key in response data but it was not found"

# Test updating an existing dog for a user
def test_update_dog(client, mock_mongo):
    user_collection = mock_mongo['user-dogs']
    user_collection.insert_one(dog_data)

    updated_dog_data = {
        'user_id': 'test1',
        'dog_name': 'Buddy',
        'dog_breed': 'Labrador',
        'dog_age': '4',
        'dog_image': base64.b64encode(dog_data['dog_image']).decode('utf-8')
    }
    
    for k in dog_data.keys():
        dog_data[k] = str(dog_data[k])

    response = client.post('/user/updateDog', json={'data': updated_dog_data, 'old_data': dog_data})
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    response = client.post('/user/getUserDogs', json={'uid': updated_dog_data['user_id']})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data[0]['dog_breed'] == 'Labrador', f"Expected dog_breed to be 'Labrador' but got {data[0]['dog_breed']}"
    assert data[0]['dog_age'] == '4', f"Expected dog_age to be '4' but got {data[0]['dog_age']}"

