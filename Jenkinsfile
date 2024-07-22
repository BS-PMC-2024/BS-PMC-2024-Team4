pipeline {
    agent any

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'yovelnir/dogworry:backend'
                    args '-u root:root -v $WORKSPACE/backend:/app/backend -w /app/backend'
                }
            }
            steps {
                script {
                    // Use pipenv to install dependencies and run backend tests
                    sh '''
                        echo "Listing contents of /app/backend"
                        ls -la /app/backend

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
                    args '-u root:root -v $WORKSPACE/frontend/dogworry:/app/frontend -w /app/frontend'
                }
            }
            steps {
                script {
                    // Use npm to install dependencies and run frontend tests
                    sh '''
                        echo "Listing contents of /app/frontend"
                        ls -la /app/frontend

                        npm install
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
