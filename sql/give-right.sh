#!/bin/sh

echo "mariadb initial setting"

mariadb -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table ${MYSQL_DATABASE}.generate (
    ts TIMESTAMP,
    user VARCHAR (256),
    repository VARCHAR (256)
);"

mariadb -u root -p${MYSQL_ROOT_PASSWORD} --execute "
create table ${MYSQL_DATABASE}.uniqueGene (
    ts TIMESTAMP,
    user VARCHAR (256),
    repository VARCHAR (256),
    uploaded int
);
"

mariadb -u root -p${MYSQL_ROOT_PASSWORD} --execute "grant select,update,insert on leadyou.* to '${MYSQL_USER}'@'%';"

echo "The mariadb initial setting is finished.🍻"
