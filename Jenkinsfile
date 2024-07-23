pipeline {
    agent any

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'yovelnir/dogworry:backend'
                    args '-u root:root -v $WORKSPACE/backend:/app/backend -w /app/backend' // Mount workspace
                    reuseNode true
                }
            }
            environment {
                MONGODB_USER = credentials('MONGODB_USER')
                MONGODB_PASSWORD = credentials('MONGODB_PASSWORD')
            }
            steps {
                script {
                    // Use pipenv to install dependencies and run backend tests
                    sh '''
                        # Move to the mounted workspace directory
                        cd backend

                        # Clean virtual environment if it exists
                        pipenv --rm || true

                        # Install dependencies from Pipfile, including dev packages
                        pipenv install --dev

                        # List installed packages to verify pytest installation
                        pipenv run pip list

                        # Run tests
                        pipenv run pytest
                    '''
                }
            }
        }

        stage('Frontend Tests') {
            agent {
                docker {
                    image 'yovelnir/dogworry:frontend'
                    args '-u root:root -v $WORKSPACE/frontend/dogworry:/app/frontend/dogworry -w /app/frontend/dogworry' // Mount workspace
                    reuseNode true
                }
            }
            environment {
                EXPO_PUBLIC_FIRE_API_KEY = credentials('EXPO_PUBLIC_FIRE_API_KEY')
                EXPO_PUBLIC_FIRE_AUTH_KEY = credentials('EXPO_PUBLIC_FIRE_AUTH_KEY')
                EXPO_PUBLIC_FIRE_PROJECT_ID = credentials('EXPO_PUBLIC_FIRE_PROJECT_ID')
                EXPO_PUBLIC_FIRE_STORAGE_BUCKET = credentials('EXPO_PUBLIC_FIRE_STORAGE_BUCKET')
                EXPO_PUBLIC_FIRE_MSG_SENDER_ID = credentials('EXPO_PUBLIC_FIRE_MSG_SENDER_ID')
                EXPO_PUBLIC_FIRE_APP_ID = credentials('EXPO_PUBLIC_FIRE_APP_ID')
                EXPO_PUBLIC_FIRE_MEASURE_ID = credentials('EXPO_PUBLIC_FIRE_MEASURE_ID')
            }
            steps {
                script {
                    // Run your frontend tests here
                    sh '''
                        # Move to the mounted workspace directory
                        cd frontend/dogworry
                        npm install --quiet
                        npm test
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up workspace after the build
                cleanWs()
            }
        }
        success {
            script {
                // Actions to perform on successful build
                echo 'Build succeeded!'
            }
        }
        failure {
            script {
                // Actions to perform on failed build
                echo 'Build failed!'
            }
        }
    }
}
