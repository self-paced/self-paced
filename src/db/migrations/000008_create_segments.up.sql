CREATE TABLE IF NOT EXISTS segments (
       id serial primary key,
       account_id int not null,
       account_user_id int not null,
       datum_id int not null,
       number int unique not null,
       title varchar(255) not null,
       path varchar(255),
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       
       foreign key (account_id) references accounts(id),
       foreign key (account_user_id) references account_user(id),
       foreign key (datum_id) references data(id)
       )

