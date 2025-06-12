pipeline {
    agent any

    environment {
        NODE_VERSION = '18.19.0'
        NG_CLI_VERSION = '18.2.17'
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
                    cd TaskIQ
                    npm install
                    npm install -g vercel
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    echo Building Angular application...
                    cd TaskIQ
                    ng build --configuration production --progress
                '''
            }
        }

        stage('Deploy to Vercel') {
            steps {
                bat '''
                    echo Creating vercel.json...
                    cd TaskIQ
                    (
                        echo {
                        echo   "version": 2,
                        echo   "builds": [
                        echo     {
                        echo       "src": "dist/**",
                        echo       "use": "@vercel/static"
                        echo     }
                        echo   ],
                        echo   "routes": [
                        echo     {
                        echo       "src": "/(.*)",
                        echo       "dest": "/dist/$1"
                        echo     }
                        echo   ],
                        echo   "git": {
                        echo       "deploymentEnabled": false
                        echo     }
                        echo }
                    ) > vercel.json

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