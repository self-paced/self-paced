CREATE TABLE IF NOT EXISTS data (
       id serial primary key,
       account_id int not null,
       data_type_id int not null,
       number varchar(100) unique not null,
       title varchar(255) not null,
       record_count int not null default 0,
       size int not null default 0,
       created_by int not null,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

       foreign key (account_id) references accounts(id),
       foreign key (data_type_id) references data_types(id),
       foreign key (created_by) references account_users(id)
);
