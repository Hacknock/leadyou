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
values('Hacknock', 'hogehoge');
"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert,delete on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
