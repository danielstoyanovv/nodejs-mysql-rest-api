pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image: "node:alpine"
                    reuseNode: true
                }
            }
            steps {
                sh '''
                    node --version
                    npm --version
                    ls -la
                '''
            }
        }
    }
}
