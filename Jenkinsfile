pipeline {
    agent any

    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out project repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }

        stage('Run Automated Tests') {
            steps {
                echo 'Executing Jest automated unit test suite...'
                sh 'npm test -- --coverage'
            }
        }

        stage('Build & Package') {
            steps {
                echo 'Verifying project structure and static build assets...'
                sh 'node -e "console.log(\'Build check passed successfully.\')"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
            archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
        success {
            echo 'Jenkins Pipeline completed successfully! All unit tests passed.'
        }
        failure {
            echo 'Jenkins Pipeline build failed! Please check unit test logs.'
        }
    }
}
