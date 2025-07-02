pipeline {
    agent any

    stages {
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
        stage("AWS") {
                    agent {
                        docker {
                            image "amazon/aws-cli"
                            args "--entrypoint=''"
                        }
                    }
                    environment {
                        AWS_S3_BUCKET = "my_s3_bucket"
                    }
                    steps {
                        withCredentials([usernamePassword(credentialsId: 'my-aws', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                                sh '''
                                    aws --version
                                    aws s3 sync src s3://$AWS_S3_BUCKET
                                '''
                        }
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
