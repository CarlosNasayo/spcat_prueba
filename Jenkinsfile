// Define an empty map for storing remote SSH connection parameters
def remote = [:]

pipeline {
    agent any

    environment {
        server_name = credentials('name_spcat')
        server_host = credentials('host_spcat')
        ssh_key = credentials('spcat_key')
        port_api = credentials('api_spcat_port')
    }

    stages {
        stage('Connection to AWS server') {
            steps {
                script {
                    // Set up remote SSH connection parameters
                    remote.allowAnyHosts = true
                    remote.identityFile = ssh_key
                    remote.user = ssh_key_USR
                    remote.name = server_name
                    remote.host = server_host
                    
                }
            }
        }
        stage('Verify webapp folder and environment') {
            steps {
                script {
                    
                    sshCommand remote: remote, command: '''
                        # Verify and create the api_SPCAT folder if it does not exist
                        if [ ! -d webapp_SPCAT ]; then
                            mkdir ./webapp_SPCAT
                            cd ./webapp_SPCAT
                        fi
                    '''
                    
                }
            }
        }
        
        /* stage('Stop previous API') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Stop the API if it is running
                        if [ -f pid.txt ]; then
                            PID_API_SPCAT=$(cat pid.txt)
                            kill "$PID_API_SPCAT"
                        fi
                    '''
                }
            }
        } */
        
        /* stage('Backup previous files') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Saving old API files
                        cd ./api_SPCAT
                        rm -rf api_antiguo
                        if [ -d api_actual ]; then
                            mv api_actual api_antiguo
                        fi
                    '''
                }
            }
        } */
        
        stage('Download latest release') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Download the latest release f1081419031Nasa@rom GitHub
                        cd ./webapp_SPCAT
                        rm -rf build
                        if [ ! -d build ]; then
                            mkdir ./build
                        fi
                        curl -LOk https://github.com/CarlosNasayo/spcat_prueba/releases/latest/download/releaseFront.zip
                        unzip releaseFront.zip -d build
                        rm -r  releaseFront.zip
                    '''
                }
            }
        }

        stage('setup api google key') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # setup the key
                        api_google=$(grep -oP "(?<=API_GOOGLE_KEY=).+" ./variables_webapp.txt)
                        sed -i "s/keyhere/$api_google/g" ./webapp_SPCAT/build/index.html
                    '''
                }
            }
        }

        stage('Verify and control PM2 service') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        # Verify and control PM2 service
                        cd ./webapp_SPCAT
                        if pm2 show static-page-server-3000 >/dev/null 2>&1; then
                            echo "stopping PM2 process..."
                            pm2 stop static-page-server-3000
                        fi
                        echo "starting PM2 process..."
                        pm2 serve build 3000 --spa
                    '''
                }
            }
        }






        
        /* stage('Update dependencies') {
            steps {
                script {
                    sshCommand remote: remote, command: '''
                        cd ./api_SPCAT
                        # Activate the virtual environment
                        source env/bin/activate
                        
                        # Updating the dependencies
                        pip install --upgrade setuptools wheel
                        pip install -r api_actual/requirements.txt
                    '''
                }
            }
        } */
        
        /* stage('Start API') {
            steps {
                script {
                    def port = port_api
                    sshCommand remote: remote, command: '''
                        cd ./api_SPCAT
                        # Activate the virtual environment
                        source env/bin/activate

                        cd ./api_actual

                        # Necessary variables

                        export DEBUG=false
                        export API_SPCAT_PORT=${port}
                        export CONNECTION_DB=mongodb://root:s3cr3t@localhost:27017/dbgap?authSource=admin

                        env

                        # Start API
                        # nohup gunicorn api:app > api_spcat.log 2>&1 &
                        
                        # Get the new PID and save it to a file
                        PID_API_SPCAT=$!
                        echo $PID_API_SPCAT > ../pid.txt
                    '''
                }
            }
        } */
    }

    /* post {
        failure {
            script {
                sshCommand remote: remote, command: '''
                    # Rollback to the previous API if any step fails
                    cd ./api_SPCAT
                    rm -rf api_actual
                    mv api_antiguo api_actual

                    cd ./api_actual
                    source env/bin/activate

                    nohup gunicorn api:app > api_spcat.log 2>&1 &
                    PID_API_SPCAT=$!
                    echo $PID_API_SPCAT > ../pid.txt
                '''
            }
        }
    } */
}