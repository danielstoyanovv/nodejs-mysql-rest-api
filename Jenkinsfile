pipeline {
    agent any

    stages {
        /*
        Build process stage
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
        // Test process stage
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
