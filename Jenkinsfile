pipeline {
    agent any

    environment {
        NODE_VERSION = '20.19.0'
        NPM_VERSION = '10.2.3'
        NG_CLI_VERSION = '20.0.2'
        VERCEL_TOKEN = credentials('vercel_token')
        VERCEL_ORG_ID = credentials('vercel_org_id')
        VERCEL_PROJECT_ID = credentials('vercel_project_id')
        VERCEL_PROJECT_NAME = 'task-iq'
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
                    npm install -g vercel@38.3.2
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    echo Building Angular application...
                    ng build --configuration production --progress
                    
                    echo Verifying build output...
                    if not exist "dist\\task-iq\\browser\\index.html" (
                        echo Build output not found!
                        dir dist\\task-iq
                        exit /b 1
                    )
                    echo Build output verified successfully.
                '''
            }
        }

        stage('Deploy to Vercel') {
            steps {
                bat '''
                    echo Creating vercel.json in build output directory...
                    (
                        echo {
                        echo   "version": 2,
                        echo   "builds": [
                        echo     {
                        echo       "src": "./**",
                        echo       "use": "@vercel/static"
                        echo     }
                        echo   ],
                        echo   "routes": [
                        echo     {
                        echo       "src": "/(.*)",
                        echo       "dest": "/$1"
                        echo     }
                        echo   ],
                        echo   "git": {
                        echo       "deploymentEnabled": false
                        echo     }
                        echo }
                    ) > dist\\task-iq\\browser\\vercel.json

                    echo Verifying build output directory...
                    dir dist\\task-iq\\browser

                    echo Deploying to Vercel...
                    vercel deploy dist\\task-iq\\browser --token %VERCEL_TOKEN% --prod --yes --scope %VERCEL_ORG_ID% --project %VERCEL_PROJECT_NAME%

                    echo Verifying deployment...
                    vercel ls --token %VERCEL_TOKEN% --limit 1 --scope %VERCEL_ORG_ID%

                    echo Checking deployment status...
                    vercel inspect --token %VERCEL_TOKEN% --prod --scope %VERCEL_ORG_ID%
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
