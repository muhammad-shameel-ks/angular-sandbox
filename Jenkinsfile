pipeline {
    agent none

    stages {
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root'
                }
            }
            steps {
                dir('apps/frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Backend') {
            agent {
                docker {
                    image 'mcr.microsoft.com/dotnet/sdk:10.0'
                    args '-u root'
                }
            }
            steps {
                dir('apps/backend') {
                    sh 'dotnet restore'
                    sh 'dotnet build'
                }
            }
        }
        stage('Test Backend') {
            agent {
                docker {
                    image 'mcr.microsoft.com/dotnet/sdk:10.0'
                    args '-u root'
                }
            }
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
