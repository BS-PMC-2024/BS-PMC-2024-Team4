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
    db = mock_client['Reports']
    mongo.set_client(mock_client)  
    return db

# Test submitting a bug report successfully
def test_submit_bug_report_success(client, mock_mongo):
    bug_data = {
        'user_id': '123',
        'screen': 'info',
        'description': 'Button not working'
    }

    response = client.post('/user/submitBugsReport', json=bug_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['message'] == 'Bug report submitted successfully', f"Expected message to be 'Bug report submitted successfully' but got {data['message']}"

    # Check that the bug report was added to the mock database
    bug_collection = mock_mongo['app_bugs_reports']
    inserted_bug = bug_collection.find_one({'user_id': bug_data['user_id']})
    assert inserted_bug is not None, "Expected the bug report to be inserted in the database but it was not found"
    assert inserted_bug['screen'] == bug_data['screen'], f"Expected screen to be '{bug_data['screen']}' but got {inserted_bug['screen']}"
    assert inserted_bug['description'] == bug_data['description'], f"Expected description to be '{bug_data['description']}' but got {inserted_bug['description']}"
    assert inserted_bug['status'] == 'waiting', f"Expected status to be 'waiting' but got {inserted_bug['status']}"

# Test submitting a bug report without user_id
def test_submit_bug_report_missing_user_id(client):
    bug_data = {
        'screen': 'Main Screen',
        'description': 'Button not working'
    }

    response = client.post('/user/submitBugsReport', json=bug_data)
    assert response.status_code == 400, f"Expected status code 400 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['error'] == 'user_id is required', f"Expected error message to be 'user_id is required' but got {data['error']}"