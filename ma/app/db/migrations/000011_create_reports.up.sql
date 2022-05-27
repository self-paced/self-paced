CREATE TABLE IF NOT EXISTS reports (
       id serial primary key,
       account_id int not null,
       account_user_id int not null,
      object_id int not null,
       number varchar(100) unique not null,
       title varchar(255) not null,
       description varchar(255),
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ, 
       
       foreign key (account_id) references accounts(id),
       foreign key (account_user_id) references account_users(id),
      foreign key (object_id) references objects(id)
       );
