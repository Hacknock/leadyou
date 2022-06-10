#!/bin/sh

echo "mariadb initial setting"

mariadb -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table if not exists ${MYSQL_DATABASE}.generated (
    ts TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL
);"

mariadb -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert,delete on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
