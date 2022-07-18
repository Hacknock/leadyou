#!/bin/sh

echo "mysql initial setting"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table if not exists ${MYSQL_DATABASE}.generated (
    ts  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL
);"

mysql -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert,delete on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
