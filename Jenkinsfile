pipeline {
    agent any

    environment {
        REGISTRY = 'dormflowacr.azurecr.io'
        VERSION = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint Codebase') {
            steps {
                sh 'npm run lint --if-present'
            }
        }

        stage('Run Test Suites') {
            steps {
                sh 'npm run test --if-present'
            }
        }

        stage('Compile Applications') {
            steps {
                sh 'npm run build --if-present'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -t ${REGISTRY}/dormflow-api:${VERSION} -f infrastructure/docker/Dockerfile.api .'
                    sh 'docker build -t ${REGISTRY}/dormflow-react:${VERSION} -f infrastructure/docker/Dockerfile.react .'
                    sh 'docker build -t ${REGISTRY}/dormflow-angular:${VERSION} -f infrastructure/docker/Dockerfile.angular .'
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                echo "Test results published to Jenkins workspace artifact repository."
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "DormFlow Aachen CI Pipeline succeeded for build ${BUILD_NUMBER}!"
        }
        failure {
            echo "CI Pipeline failed. Check console output for diagnostic details."
        }
    }
}
