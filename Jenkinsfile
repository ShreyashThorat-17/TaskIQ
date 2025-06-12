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
                    echo Cleaning up old Vercel config...
                    cd TaskIQ
                    if exist ".vercel" (
                        rmdir /s /q ".vercel"
                    )

                    echo Creating vercel.json in build output directory...
                    (
                        echo {
                        echo   "version": 2,
                        echo   "builds": [
                        echo     {
                        echo       "src": "index.html",
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

                    echo Changing directory to build output for deployment...
                    cd dist\\task-iq\\browser

                    echo Current directory:
                    cd

                    echo Deploying to Vercel...
                    echo ===========================================
                    echo === VERCEL DEPLOYMENT OUTPUT STARTS HERE ===
                    echo ===========================================
                    vercel deploy --token %VERCEL_TOKEN% --prod --yes --debug --cwd .
                    echo ===========================================
                    echo === VERCEL DEPLOYMENT OUTPUT ENDS HERE ===
                    echo ===========================================
                    echo PLEASE LOCATE THE DEPLOYMENT URL IN THE OUTPUT ABOVE.

                    echo Going back to project root for verification commands...
                    cd ..\\..\\..\\ :: Back to TaskIQ

                    echo Verifying deployment...
                    vercel ls --token %VERCEL_TOKEN% --limit 1 --debug

                    echo Checking deployment status...
                    vercel inspect --token %VERCEL_TOKEN% --prod
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully! Application deployed to Vercel.'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs for details.'
        }
    }
}
