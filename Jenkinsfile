pipeline {
    agent any

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'yovelnir/dogworry:backend'
                    args '-u root:root -v $WORKSPACE/backend:/app/backend' 
                }
            }
            steps {
                script {
                    sh '''
                        cd /app/backend

                        # Clean virtual environment
                        pipenv --rm || true

                        pipenv shell
                        
                        # Install dependencies from Pipfile
                        pipenv install

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
                    args '-u root:root -v $WORKSPACE/frontend/dogworry:/app/frontend/dogworry'
                }
            }
            steps {
                script {
                    sh '''
                        cd /app/frontend/dogworry
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
                cleanWs()
            }
        }
        success {
            script {
                echo 'Build succeeded!'
            }
        }
        failure {
            script {
                echo 'Build failed!'
            }
        }
    }
}
