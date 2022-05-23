CREATE TABLE IF NOT EXISTS where_queries (
       id serial primary key,
       account_id int not null,
       object_difinition_id int not null,
       operator varchar(10) not null,
       value varchar(100) not null,
       connector varchar(50),
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       foreign key (account_id) references accounts(id),
       foreign key (object_difinition_id) references object_difinitions(id)
       );
       