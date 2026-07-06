pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Frontend') {
            steps {
                dir('apps/frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('apps/backend') {
                    sh 'dotnet restore'
                    sh 'dotnet build'
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('apps/backend') {
                    sh 'dotnet test'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
