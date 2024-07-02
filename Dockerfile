#set base image
FROM python:3.12

#set the working directory in the container
WORKDIR /app

#copy the dependencies file to the working directory
COPY backend/Pipfile backend/Pipfile.lock ./

#install dependencies
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile

#copy the contant of the local src directory to the working directory
COPY backend/ .

# Set the environment variables for Flask
ENV FLASK_APP=app.py

#Expose the port the app run of
EXPOSE 5000

#command to run on container start
CMD ["pipenv", "run", "flask", "run", "--host=0.0.0.0"]