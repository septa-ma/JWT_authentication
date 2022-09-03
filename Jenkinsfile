pipeline{
    environment{
        registry = "maria22ri/my-auth-app"
        registryCredential = "my-auth-app_id"
        dockerImage = ''
    }
    agent any
    stages{
        stage('Cloning git repo')
        {
            steps{
                git 'https://github.com/mariam-asaD/JWT_authentication.git'
            }
        }
        stage('Building docker image'){
            steps{
                script{
                    dockerImage=docker.build registry+":$BUILD_NUMBER"
                }
            }
        }
        stage('Push docker image'){
            steps{
                script{
                    docker.withRegistry('',registryCredential){
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Clean up'){
            steps{
                sh "docker rmi $registry:$BUILD_NUMBER"
            }
        }
    }
}