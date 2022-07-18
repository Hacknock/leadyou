#!/bin/sh

echo "mysql initial setting"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table if not exists ${MYSQL_DATABASE}.generated (
    ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL
);
insert into ${MYSQL_DATABASE}.generated(ts, owner, repository, branch)
values('2042-06-27 04:02:32', 'Hacknock', 'test', 'main');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-27 04:02:32', 'Hahaha', 'cook');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-28 04:02:42','Hacknock', 'hogehoge');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-28 04:03:32','neconecopo', 'esa');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-28 04:03:42','penguin', 'sakana');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-28 04:04:52','dog', 'ball');

insert into ${MYSQL_DATABASE}.generated(ts, owner, repository)
values('2042-06-28 04:05:32','mouse', 'cheese');
"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert,delete on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
