# --- !Ups
drop table if exists "product";
drop table if exists "category";
drop table if exists "product_opinion";
drop table if exists "opinion";
drop table if exists "pricing";
drop table if exists "tag";
drop table if exists "order";
drop table if exists "order_product";
drop table if exists "user";

create table "product" (
  id          integer not null primary key autoincrement,
  name        varchar not null,
  price       numeric not null,
  description text    not null,
  category    int     not null,
  foreign key (category) references `category` (id)
);

create table "category" (
  id   integer not null primary key autoincrement,
  name varchar not null
);

create table "opinion" (
  "id"         integer not null primary key autoincrement,
  "product_id" integer not null,
  "text"       text    not null,
  foreign key (product_id) references `product` (id)
);

create table "tag" (
  "id"         integer not null primary key autoincrement,
  "product_id" integer not null,
  "text"       text    not null,
  foreign key (product_id) references `product` (id)
);

create table "order" (
  id      integer not null primary key autoincrement,
  user_id integer not null,
  done    boolean                      default false,
  foreign key (user_id) references `user` (id)
);

create table "order_product" (
  id         integer not null primary key autoincrement,
  order_id   integer not null,
  product_id integer not null,
  quantity   integer not null,
  foreign key (order_id) references `order` (id),
  foreign key (product_id) references `product` (id)
);

create table "user" (
  id                       integer        not null primary key autoincrement,
  email                    varchar2(5000) not null unique,
  role                     integer        not null,
  google_token             text,
  google_token_expiry_date timestamp,
  github_token             text,
  github_token_expiry_date timestamp
);

create table "last_search" (
  "id"        integer not null primary key autoincrement,
  "user_id"   integer not null,
  "text"      text    not null,
  "timestamp" timestamp,
  foreign key (user_id) references `user` (id)
);

-- -------
INSERT INTO "category" (name) VALUES ('kategoria 001');
INSERT INTO "category" (name) VALUES ('kategoria 002');
-- -------
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 001', 12.72, 'Opis produktu 001', 1);
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 002', 00.99, 'Opis produktu 002', 1);
INSERT INTO "product" (name, price, description, category) VALUES ('produkt 003', 102.4287255, 'Opis produktu 003', 2);
-- -------
INSERT INTO "user" (email, role) VALUES ('konto.do.testow123@gmail.com', 2);
-- -------
INSERT INTO "tag" ("product_id", "text") VALUES (1, 'szybki'), (1, 'czerwony'), (1, 'szerszeń');
INSERT INTO "tag" ("product_id", "text") VALUES (2, 'brzydki'), (2, 'zły'), (2, 'szczery');
-- -------
INSERT INTO "opinion" ("product_id", "text")
VALUES (2, 'Uwielbiam ten produkt'), (2, 'Jest najlepszy'), (2, 'Jest najgorszy');
-- -------
INSERT INTO "order" ("user_id", "done") values (1, 0);
INSERT INTO "order_product" ("order_id", "product_id", "quantity") values (1, 1, 1);
INSERT INTO "order_product" ("order_id", "product_id", "quantity") values (1, 2, 3);
INSERT INTO "order_product" ("order_id", "product_id", "quantity") values (1, 4, 2);
INSERT INTO "order_product" ("order_id", "product_id", "quantity") values (1, 3, 4);
# --- !Downs

drop table if exists "product";
drop table if exists "category";
drop table if exists "product_opinion";
drop table if exists "opinion";
drop table if exists "order";
drop table if exists "pricing";
drop table if exists "last_search";