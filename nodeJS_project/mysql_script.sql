use dockerDB;
create table user_db(
    id int auto_increment primary key,
    username varchar(50) not null unique,
    pass varchar(256)not null,
    token varchar(256),
    tokenExpiration datetime,
    email varchar(256),
    vote int
)

create table user_vote(
id int auto_increment primary key,
username varchar(50) not null unique,
email varchar(50) not null unique,
vote int );

create table polls (
id int auto_increment primary key,
title varchar(50) not null,
user_create varchar(50) not null
);

create table user_options(
id int auto_increment primary key,
username varchar(50),
poll_id int,
option_id int
);

create table options (
id int auto_increment primary key,
poll_id int,
option_id int ,
option_title varchar(50),
foreign key (poll_id) references polls(id)
);