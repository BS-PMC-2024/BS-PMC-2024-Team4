# tests/test_routes.py
import pytest
from app import create_app, mongo
from app.map.routes import haversine, calcRoute
from mongomock import MongoClient as MockMongoClient
from unittest.mock import patch
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
    mongo.set_client(mock_client)  # Ensure the mock client is set globally for use in the app
    return db

def test_haversine():
    # Coordinates of two points
    lat1, lon1 = 52.2296756, 21.0122287
    lat2, lon2 = 41.8919300, 12.5113300
    # Expected distance
    expected_distance = 1318.1385  # in kilometers
    assert pytest.approx(haversine(lat1, lon1, lat2, lon2), 0.01) == expected_distance

def test_calcRoute():
    coords = [52.2296756, 21.0122287]
    routes = [
        {'route': [[41.8919300, 12.5113300], [52.2296756, 21.0122287]]},
        {'route': [[48.8566, 2.3522], [51.5074, -0.1278]]},
        {'route': [[34.0522, -118.2437], [40.7128, -74.0060]]}
    ]
    result = calcRoute(coords, routes)
    assert len(result) == 3  # top_n=3
    assert result[0]['route'] == [[41.8919300, 12.5113300], [52.2296756, 21.0122287]]

def test_paths_success(client, mock_mongo):
    mock_routes = [
        {"route_name": "Route 1", "route": [[34.0522, -118.2437], [34.0522, -118.2436]]},
        {"route_name": "Route 2", "route": [[34.0523, -118.2437], [34.0523, -118.2436]]},
        {"route_name": "Route 3", "route": [[34.0524, -118.2437], [34.0524, -118.2436]]}
    ]
    routes_collection = mock_mongo['routes']
    routes_collection.insert_many(mock_routes)

    response = client.post('/map/paths', json={"coords": [34.0522, -118.2437]})

    assert response.status_code == 200
    data = response.get_json()
    assert "routes" in data
    assert len(data["routes"]) == 3

def test_paths_failure(client):
    with patch('app.map.routes.mongo.client.get_database', side_effect=Exception("Database Error")), \
         patch('app.map.routes.request.get_json', return_value={"coords": [34.0522, -118.2437]}):
        
        response = client.post('/map/paths')
        
    assert response.status_code == 404
    assert response.data.decode() == "Something went wrong while fetching routes"
