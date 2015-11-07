CREATE TABLE users (
     id serial PRIMARY KEY,
     name varchar(225) NOT NULL CHECK (name <> ''),
     email varchar(255) unique NOT NULL CHECK (email <> ''),
     password varchar(255) NOT NULL 
);