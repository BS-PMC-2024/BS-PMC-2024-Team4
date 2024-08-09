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


def test_get_blocked_areas(client, mock_mongo):
    areas_collection = mock_mongo['road_blockings']
    areas_collection.insert_many([
        {"_id": "1", "latitude": "31.25579", "longitude": "34.7893", "address":"Bezalel 50", "radius": "25","reporter": "municipality",
         "handler": "municipality", "description": "Road is blocked due to installation of an underground garbage container"},
        {"_id": "2", "latitude": "31.26219", "longitude": "34.7891", "address":"Shlomo Hamelech 7", "radius": "25","reporter": "citizen",
         "handler": "municipality", "description": "Electricity works"},
    ])

    response = client.get('info/getBlockedAreas/')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert data[0]['_id'] == '1'
    assert data[0]['latitude'] == '31.25579'
    assert data[1]['_id'] == '2'
    assert data[1]['latitude'] == '31.26219'

def test_get_blocked_areas_no_data(client, mock_mongo):
    areas_collection = mock_mongo['road_blockings']
    areas_collection.delete_many({})

    response = client.get('info/getBlockedAreas/')
    assert response.status_code == 404, f"Expected status code 404 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['error'] == "Unable to load data", f"Expected error message to be 'Unable to load data' but got {data['error']}"