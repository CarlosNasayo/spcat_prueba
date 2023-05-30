/* pipeline {

    agent any

    stages {
        stage('Ssh') {
            steps {
                script {
                    withCredentials(bindings: [sshUserPrivateKey(credentialsId: '', keyFileVariable: 'SSH_KEY')]) {
                        def remote = [name: "Parks", host: "", user: "", allowAnyHosts: true, identityFile: SSH_KEY]
                        sshCommand remote: remote, sudo: false, command: "ls"
                    }
                }
            }
        }
        stage('Get release') {
            steps {
                sh """ls"""
                //sh """ls"""
                //sh """rm -fr src"""
                //sh """rm -fr releaseApi.zip"""
            }
        }
    }
 
} */

pipeline {
    agent any

    environment {
        remote = null
        name = credentials('spcat_name')
        host = credentials('spcat_host')
    }
    
    stages {
        stage('SSH to AWS server') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'spcat_key', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
                        def remote = [:]
                        remote.user = 'spcat'
                        remote.name = 'Parks'
                        remote.host = '172.30.1.114'
                        remote.allowAnyHosts = true
                        remote.identityFile = identity

                        // Definir la variable remote fuera del bloque script

                        sshCommand remote: remote, sudo: false, command: "ls"
                        
                        sshCommand remote: remote, command: 
                            # Inicio de sesión en el servidor AWS
                            # Verificar y crear la carpeta website_SPCAT si no existe 
                            if [ -d website_SPCAT ]; then
                                cd ./website_SPCAT
                            else
                                mkdir ./website_SPCAT
                                cd ./website_SPCAT
                            fi
                        
                    }
                }
            }
        }
        
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: env.remote, command: 
                        # Descargar el último release desde GitHub
                        curl -LOk https://github.com/CarlosNasayo/spcat_prueba/releases/latest/download/releaseFront.zip
                        unzip releaseApi.zip -d website_SPCAT
                }
            }
        }
        /* stage('Stop previous API') {
            steps {
                script {
                    sshCommand remote: env.remote, command: '''
                        # Detener la API si está en ejecución
                        if [ -n "$PID_API_SPCAT" ]; then
                            kill "$PID_API_SPCAT"
                        fi
                    '''
                }
            }
        }
        
        stage('Backup previous files') {
            steps {
                script {
                    sshCommand remote: env.remote, command: '''
                        # Guardar archivos antiguos de la API
                        rm -rf api_antiguo
                        mv api_actual api_antiguo
                    '''
                }
            }
        }
        
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: env.remote, command: '''
                        # Descargar el último release desde GitHub
                        rm -rf releaseApi.zip
                        curl -LOk https://github.com/victor-993/spcat_webapi/releases/latest/download/releaseApi.zip
                        rm -rf api_actual
                        unzip releaseApi.zip -d api_actual
                    '''
                }
            }
        }
        
        stage('Update dependencies') {
            steps {
                script {
                    sshCommand remote: env.remote, command: '''
                        # Acceder al entorno virtual
                        source env/bin/activate
                        
                        # Actualizar las dependencias
                        pip install -r api_actual/requirements.txt
                    '''
                }
            }
        }
        
        stage('Start API') {
            steps {
                script {
                    sshCommand remote: env.remote, command: '''
                        # Iniciar la API
                        nohup python3 api_actual/api.py > log.txt 2>&1 &
                        
                        # Obtener el nuevo PID y guardarlo en un archivo
                        PID_API_SPCAT=$!
                        echo $PID_API_SPCAT > pid.txt
                    '''
                }
            }
        } */
    }

    post {
        success {
            emailext(
                subject: "Successful deployment of the SPCAT WEBSITE",
                body: "The SPCAT api pipeline has been executed correctly.",
                recipientProviders: [developers()],
                replyTo: "c.nasayo@cgiar.org"
            )
        }
        failure {
            emailext(
                subject: "Failure to deploy the SPCAT WEBSITE",
                body: "The SPCAT WEBSITE pipeline has failed at step ${currentBuild.currentResult.displayName}. Por favor, revisa los registros de Jenkins para obtener más detalles.",
                recipientProviders: [developers()],
                replyTo: "c.nasayo@cgiar.org"
            )
            sh 'echo "The SPCAT WEBSITE pipeline has failed at step ${currentBuild.currentResult.displayName}. Por favor, revisa los registros de Jenkins para obtener más detalles."'
        }
    }
}