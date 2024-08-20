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
    db = mock_client['Users']
    mongo.set_client(mock_client)  
    return db

# Test sending a notification successfully
def test_send_notification_success(client, mock_mongo):
    notification_data = {
        'address': '123 Main St',
        'title': 'Test Notification',
        'message': 'This is a test notification message'
    }

    response = client.post('/manager/SendNotification', json=notification_data)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['message'] == 'Notification sent successfully', f"Expected message to be 'Notification sent successfully' but got {data['message']}"

    # Check that the notification was added to the mock database
    notify_collection = mock_mongo['notifications']
    inserted_notification = notify_collection.find_one({'address': notification_data['address']})
    assert inserted_notification is not None, "Expected the notification to be inserted in the database but it was not found"
    assert inserted_notification['notificationTitle'] == notification_data['title'], f"Expected title to be '{notification_data['title']}' but got {inserted_notification['notificationTitle']}"
    assert inserted_notification['notificationMessage'] == notification_data['message'], f"Expected message to be '{notification_data['message']}' but got {inserted_notification['notificationMessage']}"

# Test sending a notification with missing data
def test_send_notification_missing_data(client):
    notification_data = {
        'address': '123 Main St',
        'title': 'Test Notification'
    }

    response = client.post('/manager/SendNotification', json=notification_data)
    assert response.status_code == 400, f"Expected status code 400 but got {response.status_code}"
    data = json.loads(response.data)
    assert data['error'] == 'Missing required data', f"Expected error message to be 'Missing required data' but got {data['error']}"