# --- !Ups
create table "product" (
  "id" integer not null primary key autoincrement,
  "name" varchar not null,
  "price" numeric not null,
  "description" text not null,
  category int not null,
  foreign key(category) references category(id)
);

create table "category" (
"id" integer not null primary key autoincrement,
"name" varchar not null
);


create table "product_opinion" (
  "product_id" integer not null,
  "opinion_id" integer not null,
  foreign key (product_id) references product (id),
  foreign key (opinion_id) references opinion (id)
);


create table "opinion" (
  "id" integer not null primary key autoincrement,
  "text" text not null
);

create table "order" (
  "id"         integer not null primary key autoincrement,
  "product_id" integer not null,
  foreign key (product_id) references product (id)
);

create table "pricing" (
  "id"         integer not null primary key autoincrement,
  "order_id" integer not null,
  "done" boolean default false,
  foreign key (order_id) references order (id)
);


# --- !Downs

drop table "product" if exists;
drop table "category" if exists;
drop table "product_opinion" if exists;
drop table "opinion" if exists;
drop table "order" if exists;
drop table "pricing" if exists;
