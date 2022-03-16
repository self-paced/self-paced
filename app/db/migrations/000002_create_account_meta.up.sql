CREATE TABLE IF NOT EXISTS account_meta (
       id serial primary key,
       account_id INT not null,
       key varchar(50) not null,
       value varchar(50) not null,
       foreign key (account_id) references accounts(id)
       );

CREATE INDEX ON public.account_meta(key);

INSERT INTO public.account_meta ( account_id, key, value )
       select 1, 'test', 'test value'
       where
       (
        NOT EXISTS
            (
              select id from public.account_meta where id = 1
              )
        );
