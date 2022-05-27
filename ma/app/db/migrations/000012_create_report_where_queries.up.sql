CREATE TABLE IF NOT EXISTS report_where_queries (
       id serial primary key,
       report_id int not null,
       where_query_id int not null,

       foreign key (report_id) references reports(id),
       foreign key (where_query_id) references where_queries(id)
       );
