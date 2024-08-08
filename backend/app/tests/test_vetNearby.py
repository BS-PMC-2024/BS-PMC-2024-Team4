import pytest
from flask import Flask
from flask_pymongo import PyMongo
from app import create_app, mongo
from mongomock import MongoClient as mongomock
import re


@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = "mongodb://localhost:27017/test_db"  
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mongo(app):
    with app.app_context():
        app.config["MONGO_URI"] = "mongodb://localhost:27017/test_db"
        mongo_client = mongomock()
        app.config['MONGO_CLIENT'] = mongo_client
        mongo.db = mongo_client['test_db']
        
        # Ensure the vets collection is cleared before each test
        yield mongo
        mongo.db.vets.drop()
        mongo_client.close()

def test_database_not_empty(client, mongo):
    test_vet = {
        "name": "Test Vet",
        "address": "Test Address",
        "latitude": "31.27179407552312",
        "longitude": "34.77245448672832",
        "openingHours": "9 AM - 5 PM"
    }
    mongo.db.vets.insert_one(test_vet)
    response = client.get('/info/getVets/')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0

def test_latitude_longitude_validity(client, mongo):
    
    test_vet = {
        "name": "Test Vet",
        "address": "Test Address",
        "latitude": "31.27179407552312",
        "longitude": "34.77245448672832",
        "openingHours": "9 AM - 5 PM"
    }
    mongo.db.vets.insert_one(test_vet)
    response = client.get('/info/getVets/')
    assert response.status_code == 200
    data = response.get_json()

    vet = data[0]
    assert vet['latitude'].replace('.', '', 1).isdigit()
    assert vet['longitude'].replace('.', '', 1).isdigit()

def test_opening_hours_not_empty(client, mongo):
    # Insert test data with non-empty opening hours
    test_vet = {
        "name": "Test Vet",
        "address": "Test Address",
        "latitude": "31.27179407552312",
        "longitude": "34.77245448672832",
        "openingHours": "9 AM - 5 PM"
    }
    mongo.db.vets.insert_one(test_vet)
    response = client.get('/info/getVets/')
    assert response.status_code == 200
    data = response.get_json()

    vet = data[0]
    assert vet['openingHours'] != ""

def test_address_validity(client, mongo):
    # Insert test data with a valid address
    test_vet = {
        "name": "Test Vet",
        "address": "Test Address 10",
        "latitude": "31.27179407552312",
        "longitude": "34.77245448672832",
        "openingHours": "9 AM - 5 PM"
    }
    mongo.db.vets.insert_one(test_vet)

    # Make GET request
    response = client.get('/info/getVets/')

    assert response.status_code == 200
    data = response.get_json()
    vet = data[0]

    # Check address contains only valid characters (letters, spaces, and digits)
    assert re.match(r'^[A-Za-z0-9 ]*$', vet['address'])

    # Check address does not contain mixed characters and numbers in the same word
    for word in vet['address'].split():
        assert word.isalpha() or word.isdigit()

def test_invalid_address(client, mongo):
    # Insert test data with an invalid address
    invalid_vet = {
        "name": "Invalid Vet",
        "address": "Invalid Address10",
        "latitude": "31.27179407552312",
        "longitude": "34.77245448672832",
        "openingHours": "9 AM - 5 PM"
    }
    mongo.db.vets.insert_one(invalid_vet)

    # Make GET request
    response = client.get('/info/getVets/')

    assert response.status_code == 200
    data = response.get_json()


    vet = data[0]

    # Check address contains only valid characters (letters, spaces, and digits)
    assert re.match(r'^[A-Za-z0-9 ]*$', vet['address'])

    # Check address does not contain mixed characters and numbers in the same word
    for word in vet['address'].split():
        assert word.isalpha() or word.isdigit()