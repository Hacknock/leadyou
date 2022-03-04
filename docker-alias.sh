# long version
alias docker-daemon='sudo docker-compose up --build -d'
alias docker-daemon-log='sudo docker-compose up --build'
alias docker-daemon-stop='sudo docker-compose stop'
alias docker-daemon-down='sudo docker-compose down'
alias docker-deploy='sudo docker-compose -f docker-compose.yml -f ./docker/production.yml up --build -d'
alias docker-test='sudo docker-compose -f docker-compose.yml -f ./docker/test.yml up --build --abort-on-container-exit'
alias docker-ps='sudo docker-compose ps'
alias docker-rm='sudo docker-compose rm'

# short version
alias dd=docker-daemon
alias ddl=docker-daemon-log
alias dds=docker-daemon-stop
alias ddd=docker-daemon-down
alias ddp=docker-deploy
alias dt=docker-test
alias dp=docker-ps
alias dr=docker-rm
