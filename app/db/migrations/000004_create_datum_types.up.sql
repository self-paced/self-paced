CREATE TABLE IF NOT EXISTS data_types (
       id serial primary key,
       name varchar(50) not null,
       title varchar(50) not null,
       description varchar(255)
       );

insert into public.data_types ( name, title, description )
       select 'ecforce', 'ecforceの取り込みデータ', 'ecforceの取り込みデータです。'
       WHERE
       (
        NOT EXISTS
            (
              select id from public.data_types where id = 1
            )
       );

insert into public.data_types ( name, title, description )
       select 'csv', 'CSV取り込みデータ', 'CSVで取り込んだ外部データです。'
       WHERE
       (
        NOT EXISTS
            (
              select id from public.data_types where id = 2
            )
       );

insert into public.data_types ( name, title, description )
       select 'join', '結合データ', 'ecforce ma内での結合データです。'
       WHERE
       (
        NOT EXISTS
            (
              select id from public.data_types where id = 3
            )
       );

       
       
       
       
