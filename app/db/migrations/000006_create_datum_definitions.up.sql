CREATE TABLE IF NOT EXISTS datum_difinitions (
       id serial primary key,
       account_id int not null,
       datum_id int not null,
       title varchar(100) not null,
       name varchar(100) not null,
       column_type varchar(50) not null,
       primary_flg boolean not null default false,
       column_order int not null default 0,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

       foreign key (account_id) references accounts(id),
       foreign key (datum_id) references data(id)
       
       );
       
