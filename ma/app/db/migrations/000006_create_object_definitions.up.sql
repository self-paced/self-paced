CREATE TABLE IF NOT EXISTS object_difinitions (
       id serial primary key,
       account_id int not null,
       object_id int not null,
       title varchar(100) not null,
       name varchar(100) not null,
       column_type varchar(50) not null,
       primary_flg boolean not null default false,
       column_order int not null default 0,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

       foreign key (account_id) references accounts(id),
       foreign key (object_id) references objects(id)
       
       );

insert into public.object_difinitions 
  ( 
    account_id, 
    object_id, 
    title, 
    name, 
    column_type 
  )
  select 
    1, 
    1,
    'プロジェクトID',
    'shopId',
    'String'
  WHERE
  (
    NOT EXISTS
      (
        select id from public.object_difinitions where id = 1
      )
  );

insert into public.object_difinitions 
  ( 
    account_id, object_id, title, name, column_type
  )
  select 
    1, 1, '受注商品ID', 'orderItemId', 'Int'
  WHERE
  (
    NOT EXISTS
      (
        select id from public.object_difinitions where id = 2
      )
  );

insert into public.object_difinitions 
  ( 
    account_id, object_id, title, name, column_type
  )
  select 
    1, 1, '受注ID', 'sourceId', 'Int'
  WHERE
  (
    NOT EXISTS
      (
        select id from public.object_difinitions where id = 3
      )
  );

insert into public.object_difinitions 
  ( 
    account_id, object_id, title, name, column_type
  )
  select 
    1, 1, '購入数', 'quantity', 'Int'
  WHERE
  (
    NOT EXISTS
      (
        select id from public.object_difinitions where id = 4
      )
  );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, 'テナントID', 'tenantId', 'Int'
  WHERE
  (
    NOT EXISTS
    (
      select id from public.object_difinitions where id = 5
    )
  );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '定期受注ID', 'subsOrderId', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 6
      )
    );


insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '購入回数', 'times', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 7
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '受注コード', 'orderNumber', 'String'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 8
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '小計', 'subtotal', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 9
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '割引', 'discount', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 10
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '配送料', 'delivFee', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 11
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '手数料', 'charge', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 12
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '消費税', 'tax', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 13
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '合計金額', 'total', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 14
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '支払い合計', 'paymentTotal', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 15
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '作成日', 'createdAt', 'Datetime'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 16
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '配送日時', 'shippedAt', 'Datetime'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 17
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '完了日時', 'completedAt', 'Datetime'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 18
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, 'バリアントID', 'variantsId', 'Int'
  WHERE
    (
      NOT EXISTS
        (
          select id from public.object_difinitions where id = 19
        )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '商品ID', 'productId', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 20
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, 'SKU', 'sku', 'String'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 21
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, 'コスト', 'cost', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 22
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '販売価格', 'salesPrice', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 23
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '支払いID', 'paymentsId', 'Int'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 24
      )
    );

insert into public.object_difinitions
  (
    account_id, object_id, title, name, column_type
  )
  select
    1, 1, '支払状況', 'paymentsState', 'String'
  WHERE
    (
      NOT EXISTS
      (
        select id from public.object_difinitions where id = 25
      )
    );

