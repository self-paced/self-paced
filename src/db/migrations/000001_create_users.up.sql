BEGIN;
CREATE TABLE IF NOT EXISTS user(
   id serial PRIMARY KEY,
   name VARCHAR (50) UNIQUE NOT NULL,
   age INT NOT NULL
);
COMMIT;

insert into user ( name, age ) values ( "test-1", 20 );
insert into user ( name, age ) values ( "test-2", 23 );
