CREATE TABLE IF NOT EXISTS object_join_conditions (
       id serial primary key,
       account_id int not null,
       object_id int not null,
       left_object_definition_id int not null,
       right_object_definition_id int not null,
       join_type varchar(100) not null,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       
       foreign key (account_id) references accounts(id),
       foreign key (object_id) references objects(id),
       foreign key (left_object_definition_id) references object_difinitions(id),
       foreign key (right_object_definition_id) references object_difinitions(id)
       );
       
