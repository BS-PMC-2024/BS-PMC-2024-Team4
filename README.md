# Dog Worry

Dog Worry is a mobile application which helps dog owners plan dog walks based on temperatures, currently in development.
The steps below are for development of the app. If you are working with visual code please open 2 separate terminals, one for backend and one for frontend. If you are using 2 different IDE's for the backend and frontend just follow the steps.

## Getting Started with backend
Install [Python 3.12](https://www.python.org/downloads/)
\
Use the package manager [pip](https://pip.pypa.io/en/stable/) to install pipenv.

```bash
pip install pipenv
```
Inside the backend folder enter the environment shell.
```bash
pipenv shell
```
Install all dependencies in the environment.
```bash
pipenv install
```
Start the Flask server for the backend to operate.
```bash
Python app.py
```

## Getting started with frontend
Install [Node.js](https://nodejs.org/en)
\
Inside the frontend\dogworry folder install the required pacakages for the frontend.
```bash
npm install
```
Start expo server.
```bash
npx expo start
```
Please note that for developing the IP address for requests for the backend must match your Local IPV4 Address, currently needs to be changed manually.

