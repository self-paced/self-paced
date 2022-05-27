CREATE TABLE IF NOT EXISTS report_row_queries (
  id serial primary key,
  report_id int not null,
  object_difinition_id int not null,

  foreign key (report_id) references reports(id),
  foreign key (object_difinition_id) references object_difinitions(id)
);

