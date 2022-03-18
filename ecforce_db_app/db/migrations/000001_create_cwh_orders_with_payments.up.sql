CREATE TABLE IF NOT EXISTS orders_with_payments (
       shop_id varchar(100) not null,
       order_item_id int not null,
       source_id int,
       quantity int,
       order_id int,
       tenant_id int,
       subs_order_id int,
       times int default 0,
       order_number varchar(100),
       subtotal int default 0,
       discount int default 0,
       deliv_fee int default 0,
       charge int default 0,
       tax int default 0,
       total int default 0,
       payment_total int default 0,
       created_at TIMESTAMPTZ not null,
       shipped_at TIMESTAMPTZ,
       deliverd_at TIMESTAMPTZ,
       completed_at TIMESTAMPTZ,
       variants_id int,
       product_id int,
       sku varchar(100),
       cost int default 0,
       sales_price int default 0,
       payments_id int,
       payments_state varchar(100),
       payment_method_id int,
       payments_authed_at TIMESTAMPTZ,
       payments_voided_at TIMESTAMPTZ,
       payments_completed_at TIMESTAMPTZ
)

       
       
       
