CREATE TABLE IF NOT EXISTS datum_join_conditions (
       id serial primary key,
       account_id int not null,
       datum_id int not null,
       left_datum_definition_id int not null,
       right_datum_definition_id int not null,
       join_type varchar(100) not null,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       
       foreign key (account_id) references accounts(id),
       foreign key (datum_id) references data(id),
       foreign key (left_datum_definition_id) references datum_difinitions(id),
       foreign key (right_datum_definition_id) references datum_difinitions(id)
       );
       
