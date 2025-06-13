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
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                echo '🔧 Setting up Node.js environment...'
                bat '''
                    echo Installing Node.js...
                    npm install -g @angular/cli@%NG_CLI_VERSION%
                    node --version
                    npm --version
                    ng version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing project dependencies...'
                bat '''
                    echo Installing dependencies...
                    npm install
                    
                    echo Installing Vercel CLI...
                    npm install -g vercel@latest
                    vercel --version
                '''
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building Angular application...'
                bat '''
                    echo Building Angular application...
                    ng build --configuration production --progress
                    
                    echo Verifying build output...
                    if not exist "dist\\task-iq\\browser\\index.html" (
                        echo Build output not found!
                        echo Listing dist directory contents:
                        if exist "dist" (
                            dir dist /s
                        ) else (
                            echo dist directory does not exist!
                        )
                        exit /b 1
                    )
                    echo Build output verified successfully.
                    
                    echo Build output directory contents:
                    dir dist\\task-iq\\browser
                '''
            }
        }

        stage('Deploy to Vercel') {
            steps {
                echo '🚀 Deploying to Vercel...'
                bat '''
                    echo Cleaning up old Vercel config...
                    if exist ".vercel" (rmdir /s /q ".vercel")
                    
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

                    echo Verifying vercel.json creation...
                    if exist "dist\\task-iq\\browser\\vercel.json" (
                        echo vercel.json created successfully
                        type dist\\task-iq\\browser\\vercel.json
                    ) else (
                        echo Failed to create vercel.json
                        exit /b 1
                    )

                    echo Changing to build output directory...
                    cd dist\\task-iq\\browser
                    
                    echo Current directory contents:
                    dir
                    
                    echo Current working directory:
                    cd

                    echo Deploying to Vercel...
                    vercel deploy --token %VERCEL_TOKEN% --prod --yes --debug --cwd .
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                bat '''
                    echo Checking recent deployments...
                    vercel ls --token %VERCEL_TOKEN% --scope %VERCEL_ORG_ID%
                    
                    echo Getting project information...
                    vercel project ls --token %VERCEL_TOKEN% --scope %VERCEL_ORG_ID%
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully! Application deployed to Vercel.'
            echo '🌐 Check your Vercel dashboard for deployment URL.'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs for details.'
            echo '💡 Common issues:'
            echo '   - Check if Node.js/npm versions are compatible'
            echo '   - Verify Vercel credentials are correctly configured'
            echo '   - Ensure build output directory structure is correct'
        }
    }
}