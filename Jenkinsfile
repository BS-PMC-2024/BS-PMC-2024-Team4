pipeline {
    agent any

    stages {
        stage('Backend Tests') {
            agent {
                docker {
                    image 'yovelnir/dogworry:backend'
                    args '-u root:root' // Use this if you need root permissions inside the container
                }
            }
            steps {
                script {
                    // Use pipenv to install dependencies and run backend tests
                    sh '''
                        cd backend

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
                    args '-u root:root' // Use this if you need root permissions inside the container
                }
            }
            steps {
                script {
                    // Run your frontend tests here
                    sh '''
                        cd frontend/dogworry
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
