CREATE TABLE IF NOT EXISTS object_types (
      id serial primary key,
      account_id int not null,
      name varchar(50) not null,
      title varchar(50) not null,
      description varchar(255),
      config json, 

      foreign key (account_id) references accounts(id)
       );

insert into public.object_types ( name, account_id, title, description, config )
       select 
        'ecforce', 
        1, 
        'ecforceの取り込みデータ', 
        'ecforceの接続データです。',  
        '{
          "project_id": "binariscleojp",
          "name": "テストデータ"
         }'
       WHERE
       (
        NOT EXISTS
            (
              select id from public.object_types where id = 1
            )
       );
       
