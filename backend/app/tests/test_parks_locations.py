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
    db = mock_client['Map']
    mongo.set_client(mock_client) 
    return db


def test_get_parks(client, mock_mongo):
    parks_collection = mock_mongo['parks']
    parks_collection.insert_many([
        {"_id": 1, "name": "Central Park", "address": "5th ave, New York", "latitude": "40.767638", "longitude": "-73.971892"},
        {"_id": 2, "name": "Golden Gate Park", "address": "Park presido blvd", "latitude": "37.773231", "longitude": "-122.471778"}
    ])

    response = client.get('info/getParks/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[0]['name'] == "Central Park", f"Expected name to be 'Central Park' but got {data[0]['name']}"
    assert data[1]['name'] == "Golden Gate Park", f"Expected name to be 'Golden Gate Park' but got {data[1]['name']}"
    assert data[0]['_id'] == '1', f"Expected _id to be '1' but got {data[0]['_id']}"
    assert data[1]['_id'] == '2', f"Expected _id to be '2' but got {data[1]['_id']}"

# Test fetching parks when there are no parks
def test_get_parks_empty(client, mock_mongo):
    parks_collection = mock_mongo['parks']
    parks_collection.delete_many({})

    response = client.get('info/getParks/')
    assert response.status_code == 404, f"Expected status code 404 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['error'] == "Unable to load data", f"Expected error message to be 'Unable to load data' but got {data['error']}"