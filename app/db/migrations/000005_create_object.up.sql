CREATE TABLE IF NOT EXISTS objects (
       id serial primary key,
       account_id int not null,
       object_type_id int not null,
       number varchar(100) unique not null,
       title varchar(255) not null,
       record_count int default 0,
       size int default 0,
       created_by int not null,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

       foreign key (account_id) references accounts(id),
       foreign key (object_type_id) references object_types(id),
       foreign key (created_by) references account_users(id)
);

insert into public.objects ( account_id, object_type_id, number, title, created_by )
       select 1, 1, '00000001', '接続の仮データ', 1
       WHERE
       (
        NOT EXISTS
            (
              select id from public.objects where id = 1
            )
       );
