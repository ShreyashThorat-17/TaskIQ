pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
        NG_CLI_VERSION = '17.0.0'
        VERCEL_TOKEN = credentials('vercel_token')
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
                bat '''
                    echo Installing Node.js...
                    npm install -g @angular/cli@%NG_CLI_VERSION%
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    echo Installing dependencies...
                    npm install
                    npm install -g vercel
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    echo Building Angular application...
                    ng build --configuration production
                '''
            }
        }

        stage('Test') {
            steps {
                bat '''
                    echo Running tests...
                    ng test --watch=false --browsers=ChromeHeadless
                '''
            }
        }

        stage('Deploy to Vercel') {
            steps {
                bat '''
                    echo Creating vercel.json...
                    echo {
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
                    } > vercel.json

                    echo Linking to Vercel project...
                    vercel link --token %VERCEL_TOKEN% --scope %VERCEL_ORG_ID% --project %VERCEL_PROJECT_ID% --confirm

                    echo Deploying to Vercel...
                    vercel deploy --token %VERCEL_TOKEN% --scope %VERCEL_ORG_ID% --prod --confirm
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