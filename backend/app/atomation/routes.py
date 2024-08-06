import requests
from flask import Flask, jsonify
from datetime import datetime
from datetime import timedelta
from app.atomation import ld;
import json
from bson import json_util
import time

@ld.route('/auth/login', methods=['GET'])
def login():
    login_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/auth/login"
    login_payload = {"email": "sce@atomation.net",
                     "password": "123456"}
    
    headers = {"app_version": "1.4.5.dev.4", "access_type": "5"}

    response = requests.post(login_url, data=login_payload, headers=headers)
    print(response.text)

    if response.status_code == 200:
        response_data = response.json()
        token = response_data.get("data", {}).get("token")
        refreshToken = response_data.get("data", {}).get("refresh_token")  
    if response_data:
        now = time.localtime()
        time_string = time.strftime("%Y-%m-%d %H:%M:%S", now)
        temp = {'token': token, 'refresh_Token': refreshToken, 'time': str(time_string)}
        
        try:
            with open('data.json', 'w') as file:
                json.dump(temp, file)
            print("\nToken successfully written to data.json")
        except Exception as e:
            print(f"\nFailed to write token to data.json: {e}")
    return "<p>Hello</p>", response_data

    
@ld.route('/auth/token', methods=['GET'])
def getAuthToken():
    getData = dataFile()       

    token_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/auth/token"
    headers = {"app_version": "1.4.5.dev.4", "access_type": "5"}
    request_body = {"current_token": getData['token'],
                    "refresh_token": getData['refresh_Token'],
                    "grant_type": "refresh_token"}
    
    response = requests.post(token_url, data=request_body, headers=headers)
    response_data = response.json()
    token = response_data.get("data", {}).get("token")
    refreshToken = response_data.get("data", {}).get("refresh_token") 

    if response.status_code == 200:
        now = datetime.now()
        token_data = {'token': token, 'refresh_Token': refreshToken, 'time': str(now)}
        with open('data.json', 'w') as token_file:
            json.dump(token_data, token_file)
        print("\nToken successfully written to data.json")
    else:
        print("Failed to fetch token:", response.text)
    return "<p>Hello</p>"

@ld.route('/data', methods=['GET'])
def dataFile():
    with open('data.json', 'r') as json_file:
        json_object = json.load(json_file)
    return json_object

@ld.route('/token', methods=['GET'])
def tokenFile():
    #getAuthToken()
    try:
        with open('token.json', 'r') as json_file:
            json_object = json.load(json_file)
        readings_data = json_object.get('data', {}).get('readings_data', [])
        temperatures = [round(reading.get('Temperature'), 2)  for reading in readings_data if 'Temperature' in reading]
        
    except Exception as e:
        print(e)
    
    return json_util.dumps(temperatures)

def dataTime():
    xTime = dataFile().get('time')
    if(xTime !=None):

        time_format = "%Y-%m-%d %H:%M:%S"
        parsed_time = datetime.strptime(xTime, time_format)
        current_time = datetime.now()
        time_difference = current_time - parsed_time
        is_more_than_24_hours_ago = time_difference > timedelta(hours=3)
        is_more_than_1_hour_ago = time_difference > timedelta(hours=1)
        if is_more_than_24_hours_ago == True:
            login()

        elif is_more_than_1_hour_ago == True:
            getAuthToken()

    else:
        login()



@ld.route('/fetchData', methods=['GET'])
def fetch_data():

    request_body = {"filters": {
                    "start_date": "2024-07-30T06:56:47.000Z",
                    "end_date": "2024-07-31T20:56:47.000Z",
                    "mac": [
                    "D2:34:24:34:68:70"
                    ],
                    "createdAt": True
                },
                "limit": {
                    "page": 1,
                    "page_size": 100
                }
                }

    data_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/sensors_readings"
    dataTime()
    headers = {"Authorization": f"Bearer {dataFile()['token']}", "app_version": "1.4.5.dev.4", "access_type": "5"}

    response = requests.post(data_url, json=request_body, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        with open('token.json', 'w') as token_file:
            json.dump(response_data, token_file)
        print("\nToken successfully written to token.json")
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code

    return "<p>Hello</p>"



    