create database leadyou;
create user 'generator'@'localhost' identified by 'Hf%3k@9LfU';
grant select,update,insert on leadyou.* to 'generator'@'localhost';

create table leadyou.generate
(
  ts TIMESTAMP,
  user VARCHAR
  (256),
  repository VARCHAR
  (256)
);

  create table leadyou.uniqueGene
  (
    ts TIMESTAMP,
    user VARCHAR
    (256),
  repository VARCHAR
    (256),
  uploaded int
);
