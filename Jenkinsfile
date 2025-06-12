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