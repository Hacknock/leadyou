create database leadyou;
create user 'generator'@'localhost' identified by 'Hf%3k@9LfU';
grant select,update,insert on leadyou.* to 'generator'@'localhost';

create table leadyou.generate
(
    ts TIMESTAMP,
    user varchar
    (256), repository varchar
    (256)
    );

    create table leadyou.uniqueGene
    (
        ts TIMESTAMP,
        user varchar
        (256), repository varchar
        (256),
        uploaded int;
        );