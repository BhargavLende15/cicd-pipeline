pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/YOUR_GITHUB_USERNAME/my-jenkins-ec2-pipeline.git'
            }
        }

        stage('Verify Files') {
            steps {
                sh '''
                    echo "===== CHECKING FILES ====="
                    ls -l
                    echo "===== app.js CONTENT ====="
                    cat app.js
                    echo "===== package.json CONTENT ====="
                    cat package.json
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "Starting build..."
                    rm -f build.tar
                    tar -cvf build.tar app.js package.json
                    echo "===== BUILD ARTIFACT CONTENTS ====="
                    tar -tvf build.tar
                '''
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'build.tar', fingerprint: true
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    echo "Uploading artifact to EC2..."
                    scp -o StrictHostKeyChecking=no -i /var/lib/jenkins/my-ec2-key.pem \
                        build.tar ec2-user@YOUR_EC2_PUBLIC_IP:/home/ec2-user/
                    ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/my-ec2-key.pem \
                        ec2-user@15.206.178.205 '
                        echo "Artifact received on EC2:"
                        ls -lh build.tar
                    '
                '''
            }
        }

        stage('Run App on EC2') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/my-ec2-key.pem \
                        ec2-user@15.206.178.205 '
                        echo "Stopping any running node process..."
                        pkill node || true
                        rm -rf myapp
                        mkdir myapp
                        tar -xvf build.tar -C myapp
                        cd myapp
                        echo "----- Verifying package.json -----"
                        cat package.json
                        echo "----------------------------------"
                        echo "Launching application..."
                        nohup node app.js > app.log 2>&1 &
                        echo "Application deployed successfully 🔥"
                    '
                '''
            }
        }

    }
}
