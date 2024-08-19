import pytest
from app import create_app, mongo
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
    db = mock_client['Info']
    mongo.set_client(mock_client) 
    return db


def test_get_food(client, mock_mongo):
    food_collection = mock_mongo['Food']
    food_collection.insert_many([
        {"_id": 1, "name": "apple", "status": "good"},
        {"_id": 2, "name": "banana", "status": "bad"}
    ])

    response = client.get('info/getFood/')
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['name'] == "apple", f"Expected name to be 'apple' but got {data[0]['name']}"
    assert data[1]['name'] == "banana", f"Expected name to be 'banana' but got {data[1]['name']}"
    assert data[0]['_id'] == '1', f"Expected _id to be '1' but got {data[0]['_id']}"
    assert data[1]['_id'] == '2', f"Expected _id to be '2' but got {data[1]['_id']}"

def test_get_food_empty(client, mock_mongo):
    food_collection = mock_mongo['Food']
    food_collection.delete_many({})

    response = client.get('info/getFood/')
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data == [], f"Expected an empty array but got {data}"

def test_get_food_empty(client, mock_mongo):
    food_collection = mock_mongo['Food']
    food_collection.delete_many({})

    response = client.get('info/getFood/')
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data == [], f"Expected an empty array but got {data}"
