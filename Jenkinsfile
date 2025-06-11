pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel_token')
        VERCEL_ORG_ID = credentials('vercel_org_id')
        VERCEL_PROJECT_ID = credentials('vercel_project_id')
    }

    stages {
        stage('Install Vercel CLI') {
            steps {
                bat '''
                    echo Installing Vercel CLI...
                    npm install -g vercel
                '''
            }
        }

        stage('Verify Vercel Token') {
            steps {
                bat '''
                    echo Testing Vercel Token...
                    vercel whoami --token %VERCEL_TOKEN%
                    if %ERRORLEVEL% EQU 0 (
                        echo ✅ Vercel Token is valid
                    ) else (
                        echo ❌ Vercel Token is invalid
                        exit /b 1
                    )
                '''
            }
        }

        stage('Verify Organization ID') {
            steps {
                bat '''
                    echo Testing Organization ID...
                    vercel teams ls --token %VERCEL_TOKEN% | findstr "%VERCEL_ORG_ID%"
                    if %ERRORLEVEL% EQU 0 (
                        echo ✅ Organization ID is valid
                    ) else (
                        echo ❌ Organization ID is invalid
                        exit /b 1
                    )
                '''
            }
        }

        stage('Verify Project ID') {
            steps {
                bat '''
                    echo Testing Project ID...
                    vercel project ls --token %VERCEL_TOKEN% | findstr "%VERCEL_PROJECT_ID%"
                    if %ERRORLEVEL% EQU 0 (
                        echo ✅ Project ID is valid
                    ) else (
                        echo ❌ Project ID is invalid
                        exit /b 1
                    )
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'All credentials verified successfully!'
        }
        failure {
            echo 'Credential verification failed! Check the logs for details.'
        }
    }
} 