pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel_token')
        VERCEL_ORG_ID = credentials('vercel_org_id')
        VERCEL_PROJECT_ID = credentials('vercel_project_id')
    }

    stages {
        stage('Verify Vercel Token') {
            steps {
                sh '''
                    echo "Testing Vercel Token..."
                    if vercel whoami --token ${VERCEL_TOKEN}; then
                        echo "✅ Vercel Token is valid"
                    else
                        echo "❌ Vercel Token is invalid"
                        exit 1
                    fi
                '''
            }
        }

        stage('Verify Organization ID') {
            steps {
                sh '''
                    echo "Testing Organization ID..."
                    if vercel teams ls --token ${VERCEL_TOKEN} | grep -q "${VERCEL_ORG_ID}"; then
                        echo "✅ Organization ID is valid"
                    else
                        echo "❌ Organization ID is invalid"
                        exit 1
                    fi
                '''
            }
        }

        stage('Verify Project ID') {
            steps {
                sh '''
                    echo "Testing Project ID..."
                    if vercel project ls --token ${VERCEL_TOKEN} | grep -q "${VERCEL_PROJECT_ID}"; then
                        echo "✅ Project ID is valid"
                    else
                        echo "❌ Project ID is invalid"
                        exit 1
                    fi
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