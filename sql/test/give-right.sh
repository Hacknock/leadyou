#!/bin/sh

echo "mysql initial setting"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table if not exists ${MYSQL_DATABASE}.generated (
    ts TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL
);
insert into ${MYSQL_DATABASE}.generated(owner, repository, branch)
values('Hacknock', 'test', 'main');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('Hahaha', 'cook');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('Hacknock', 'hogehoge');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('neconecopo', 'esa');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('penguin', 'sakana');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('dog', 'ball');

insert into ${MYSQL_DATABASE}.generated(owner, repository)
values('mouse', 'cheese');
"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert,delete on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
