# --- !Ups
drop table if exists "product" ;
drop table if exists "category";
drop table if exists "product_opinion";
drop table if exists "opinion";
drop table if exists "order";
drop table if exists "pricing";

create table "product" (
  id integer not null primary key autoincrement,
  name varchar not null,
  price numeric not null,
  description text not null,
  category int not null,
  foreign key(category) references `category`(id)
);

create table "category" (
id integer not null primary key autoincrement,
name varchar not null
);


create table "product_opinion" (
  product_id integer not null,
  opinion_id integer not null,
  foreign key (product_id) references `product` (id),
  foreign key (opinion_id) references `opinion` (id)
);


create table "opinion" (
  "id" integer not null primary key autoincrement,
  "text" text not null
);

create table "order" (
  id         integer not null primary key autoincrement,
  product_id integer not null,
  foreign key (product_id) references `product` (id)
);

create table "pricing" (
  id         integer not null primary key autoincrement,
  order_id integer not null,
  done boolean default false,
  foreign key (order_id) references `order` (id)
);

INSERT INTO "category" (name) VALUES ('kategoria 001');
INSERT INTO "category" (name) VALUES ('kategoria 002');
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 001', 12.72, 'Opis produktu 001', 1);
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 002', 00.99, 'Opis produktu 002', 1);
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 003', 102.4287255, 'Opis produktu 003', 2);
# --- !Downs

drop table if exists "product" ;
drop table if exists "category";
drop table if exists "product_opinion";
drop table if exists "opinion";
drop table if exists "order";
drop table if exists "pricing";
