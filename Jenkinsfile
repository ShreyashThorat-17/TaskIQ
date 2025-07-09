pipeline {
    agent any

    environment {
        EC2_USER = 'Linux/UNIX'
        EC2_IP = '13.49.77.138'
        SSH_KEY_ID = 'ec2_ssh_key'
        APP_DIR = '/home/ec2-user/TaskIQ'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install -g @angular/cli@18'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular application...'
                sh 'ng build --configuration production'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2...'
                sshagent (credentials: [env.SSH_KEY_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'mkdir -p ${APP_DIR}'
                        scp -o StrictHostKeyChecking=no -r dist/* ${EC2_USER}@${EC2_IP}:${APP_DIR}/
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'cd ${APP_DIR} && ./deploy.sh'
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully! Application deployed to EC2.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
}