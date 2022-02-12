grant select,update,insert on leadyou.* to 'generator'@'%';

create table leadyou.generate (
    ts TIMESTAMP,
    user VARCHAR (256),
    repository VARCHAR (256)
);
create table leadyou.uniqueGene (
    ts TIMESTAMP,
    user VARCHAR (256),
    repository VARCHAR (256),
    uploaded int
);

