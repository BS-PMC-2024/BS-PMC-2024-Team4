import pytest
from flask import Flask
from app import create_app, mongo
from mongomock import MongoClient as MockMongoClient
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
    db = mock_client['lostDogs']
    mongo.set_client(mock_client)
    return db

def test_manage_lost_dogs_page(client):
    response = client.get('/manager/manageLostDogsPage')
    assert response.status_code == 200
    assert b'Manage Lost Dogs' in response.data


def test_move_report_success(mock_mongo, client):
    report_id = mock_mongo['reportLost'].insert_one({
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    }).inserted_id

    response = client.post(f'/manager/moveReport/{report_id}')
    assert response.status_code == 200
    data = response.json
    assert data['success'] is True
    assert mock_mongo['reportLost'].find_one({'_id': report_id}) is None
    assert mock_mongo['lostdog'].find_one({'_id': report_id}) is not None

def test_move_report_not_found(mock_mongo, client):
    response = client.post(f'/manager/moveReport/{ObjectId()}')
    assert response.status_code == 404
    data = response.json
    assert data['success'] is False
    assert data['message'] == 'Report not found'

def test_delete_report_success(mock_mongo, client):
    report_id = mock_mongo['reportLost'].insert_one({
        'dog_name': 'Buddy',
        'lost_area': 'Central Park',
        'owner_phone': '1234567890'
    }).inserted_id

    response = client.delete(f'/manager/deleteReport/{report_id}')
    assert response.status_code == 200
    data = response.json
    assert data['success'] is True
    assert mock_mongo['reportLost'].find_one({'_id': report_id}) is None

def test_delete_report_not_found(mock_mongo, client):
    response = client.delete(f'/manager/deleteReport/{ObjectId()}')
    assert response.status_code == 404
    data = response.json
    assert data['success'] is False
    assert data['message'] == 'Report not found'
