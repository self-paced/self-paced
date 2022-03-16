CREATE TABLE IF NOT EXISTS accounts (
       id serial primary key,
       number varchar(100) unique not null,
       name varchar(50) unique not null,
       company varchar(50) not null,
       status boolean not null default true,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
       );

insert into public.accounts ( number, name, company, status )
       select '000000001', 'superstudio', 'SUPER STUDIO', true
       WHERE
       (
        NOT EXISTS
            (
              select id from public.accounts where id = 1
            )
       );
