pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
        NG_CLI_VERSION = '17.0.0'
        // Update these to match your exact credential IDs from Jenkins
        VERCEL_TOKEN = credentials('vercel_token')  // Note: using underscore instead of hyphen
        VERCEL_ORG_ID = credentials('vercel_org_id')
        VERCEL_PROJECT_ID = credentials('vercel_project_id')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
                    sudo apt-get install -y nodejs
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install -g @angular/cli@${NG_CLI_VERSION}
                    npm install
                    npm install -g vercel
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'ng build --configuration production'
            }
        }

        stage('Test') {
            steps {
                sh 'ng test --watch=false --browsers=ChromeHeadless'
            }
        }

        stage('Deploy to Vercel') {
            steps {
                sh '''
                    # Create vercel.json if it doesn't exist
                    echo '{
                        "version": 2,
                        "builds": [
                            {
                                "src": "dist/task-iq/browser/**",
                                "use": "@vercel/static"
                            }
                        ],
                        "routes": [
                            {
                                "src": "/(.*)",
                                "dest": "/dist/task-iq/browser/$1"
                            }
                        ],
                        "git": {
                            "deploymentEnabled": false
                        }
                    }' > vercel.json

                    # Link to Vercel project
                    vercel link --token ${VERCEL_TOKEN} --scope ${VERCEL_ORG_ID} --project ${VERCEL_PROJECT_ID} --confirm

                    # Deploy to Vercel
                    vercel deploy --token ${VERCEL_TOKEN} \
                                 --scope ${VERCEL_ORG_ID} \
                                 --prod \
                                 --confirm
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully! Application deployed to Vercel.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
} 