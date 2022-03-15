CREATE TABLE IF NOT EXISTS account_users (
       id serial primary key,
       account_id int not null,
       number varchar(100) unique not null,
       name varchar(100) not null,
       email varchar(100) unique not null,
       password varchar(100) not null,
       status boolean not null default true,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
       );

insert into public.account_users ( account_id, number, name, email, password, status )
       select 1, '01293858hu', 'SUPER STUDIO USER', 'spst@super-studio.jp', 'changeme', true
       where
       (
        not exists
            (
              select id from public.account_users where id = 1
            )
       );
