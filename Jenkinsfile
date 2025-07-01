pipeline {
    agent any

    stages {
        stage("AWS") {
            agent {
                docker {
                    image "amazon/aws-cli"
                }
            }
            steps {
                sh '''
                    aws --version
                '''
            }
        }
        /*
        Build stage
        */
        stage('Build') {
            agent {
                docker {
                    image "node:alpine"
                    reuseNode true
                }
            }
            steps {
                sh '''
                    node --version
                    npm --version
                    ls -la
                    npm i
                    ls -la
                '''
            }
        }
        // Test stage
        stage("Test") {
            agent {
                docker {
                    image "node:alpine"
                    reuseNode true
                }
            }
            steps {
                  sh '''
                    npm test
                  '''
            }
        }
    }
}
