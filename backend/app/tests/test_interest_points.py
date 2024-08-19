import pytest
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
import json
from bson import ObjectId

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

# Test adding a new park
def test_add_point_of_interest_park(client, mock_mongo):
    park_data = {
        "point_name": "Central Park",
        "type": "park",
        "location": {
            "lat": "40.785091",
            "lng": "-73.968285"
        },
        "park_address": "Central Park, NY"
    }

    response = client.post('/manager/addPointOfInterest', json=park_data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"
    assert 'point_id' in data, "Expected point_id in response data but it was not found"

    # Verify the park is in the database
    park_collection = mock_mongo['parks']
    saved_park = park_collection.find_one({"_id": ObjectId(data['point_id'])})
    assert saved_park is not None, "Expected the park to be saved in the database"
    assert saved_park['name'] == "Central Park", f"Expected park name to be 'Central Park' but got {saved_park['name']}"
    assert saved_park['address'] == "Central Park, NY", f"Expected park address to be 'Central Park, NY' but got {saved_park['address']}"

# Test updating an existing park
def test_update_point_of_interest_park(client, mock_mongo):
    park_collection = mock_mongo['parks']
    point_id = park_collection.insert_one({
        "name": "Old Park",
        "latitude": 40.785091,
        "longitude": -73.968285,
        "address": "Old Address"
    }).inserted_id

    update_data = {
        "point_name": "Updated Park",
        "type": "park",
        "location": {
            "lat": "40.785091",
            "lng": "-73.968285"
        },
        "park_address": "Updated Address"
    }

    response = client.put(f'/manager/updatePointOfInterest/{point_id}', json=update_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    # Verify the park is updated in the database
    updated_park = park_collection.find_one({"_id": ObjectId(point_id)})
    assert updated_park is not None, "Expected the park to be found in the database"
    assert updated_park['name'] == "Updated Park", f"Expected park name to be 'Updated Park' but got {updated_park['name']}"
    assert updated_park['address'] == "Updated Address", f"Expected park address to be 'Updated Address' but got {updated_park['address']}"

# Test deleting an existing park
def test_delete_point_of_interest_park(client, mock_mongo):
    park_collection = mock_mongo['parks']
    point_id = park_collection.insert_one({
        "name": "Central Park",
        "latitude": 40.785091,
        "longitude": -73.968285,
        "address": "Central Park, NY"
    }).inserted_id

    response = client.delete(f'/manager/deletePointOfInterest/{point_id}?type=park')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    # Verify the park is deleted from the database
    deleted_park = park_collection.find_one({"_id": ObjectId(point_id)})
    assert deleted_park is None, "Expected the park to be deleted from the database but it still exists"

# Test deleting a non-existing point
def test_delete_point_of_interest_not_found(client, mock_mongo):
    non_existing_id = ObjectId()

    response = client.delete(f'/manager/deletePointOfInterest/{non_existing_id}?type=park')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert data['success'] is False, "Expected success to be False but got True"
    assert data['error'] == "Failed to delete point", f"Expected error to be 'Failed to delete point' but got {data['error']}"

# Test adding a new water spot
def test_add_point_of_interest_water(client, mock_mongo):
    water_data = {
        "point_name": "Water Spot",
        "type": "water",
        "location": {
            "lat": "34.052235",
            "lng": "-118.243683"
        }
    }

    response = client.post('/manager/addPointOfInterest', json=water_data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"
    assert 'point_id' in data, "Expected point_id in response data but it was not found"

    # Verify the water spot is in the database
    water_collection = mock_mongo['Water']
    saved_water = water_collection.find_one({"_id": ObjectId(data['point_id'])})
    assert saved_water is not None, "Expected the water spot to be saved in the database"
    assert saved_water['name'] == "Water Spot", f"Expected water spot name to be 'Water Spot' but got {saved_water['name']}"

# Test updating an existing water spot
def test_update_point_of_interest_water(client, mock_mongo):
    water_collection = mock_mongo['Water']
    point_id = water_collection.insert_one({
        "name": "Old Water Spot",
        "latitude": 34.052235,
        "longitude": -118.243683
    }).inserted_id

    update_data = {
        "point_name": "Updated Water Spot",
        "type": "water",
        "location": {
            "lat": "34.052235",
            "lng": "-118.243683"
        }
    }

    response = client.put(f'/manager/updatePointOfInterest/{point_id}', json=update_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True, "Expected success to be True but got False"

    # Verify the water spot is updated in the database
    updated_water = water_collection.find_one({"_id": ObjectId(point_id)})
    assert updated_water is not None, "Expected the water spot to be found in the database"
    assert updated_water['name'] == "Updated Water Spot", f"Expected water spot name to be 'Updated Water Spot' but got {updated_water['name']}"

