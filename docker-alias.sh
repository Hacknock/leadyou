# long version
alias docker-daemon='docker-compose up --build -d'
alias docker-daemon-log='docker-compose up --build'
alias docker-daemon-stop='docker-compose stop'
alias docker-daemon-down='docker-compose down'
alias docker-deploy='docker-compose -f docker-compose.yml -f ./docker/production.yml up --build -d'
alias docker-test='docker-compose -f docker-compose.yml -f ./docker/test.yml up --build --abort-on-container-exit'
alias docker-ps='docker-compose ps'
alias docker-rm='docker-compose rm'

# short version
alias dd=docker-daemon
alias ddl=docker-daemon-log
alias dds=docker-daemon-stop
alias ddd=docker-daemon-down
alias ddp=docker-deploy
alias dt=docker-test
alias dp=docker-ps
alias dr=docker-rm
