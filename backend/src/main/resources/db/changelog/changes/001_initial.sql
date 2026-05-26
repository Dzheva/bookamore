-- liquibase formatted sql

-- changeset Professional:1772965297913-1
CREATE TABLE "auth_providers" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "id" UUID NOT NULL, "user_id" UUID NOT NULL, "provider" VARCHAR(255) NOT NULL, "provider_user_id" VARCHAR(255) NOT NULL, CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-2
CREATE TABLE "books" ("year_of_release" INTEGER NOT NULL, "created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "id" UUID NOT NULL, "description" VARCHAR(500), "condition" VARCHAR(255) NOT NULL, "isbn" VARCHAR(255), "title" VARCHAR(255) NOT NULL, CONSTRAINT "books_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-3
CREATE TABLE "images" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "entity_id" UUID, "id" UUID NOT NULL, "description" VARCHAR(500), "entity_type" VARCHAR(255) NOT NULL, "path" VARCHAR(255) NOT NULL, CONSTRAINT "images_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-4
CREATE TABLE "offers" ("price" numeric(10, 2), "created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "book_id" UUID NOT NULL, "id" UUID NOT NULL, "seller_id" UUID NOT NULL, "description" VARCHAR(500), "status" VARCHAR(255) NOT NULL, "type" VARCHAR(255) NOT NULL, CONSTRAINT "offers_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-5
CREATE TABLE "authors" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "id" UUID NOT NULL, "name" VARCHAR(255) NOT NULL, CONSTRAINT "authors_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-6
CREATE TABLE "books_images" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "book_id" UUID NOT NULL, "id" UUID NOT NULL, "path" VARCHAR(255) NOT NULL, CONSTRAINT "books_images_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-7
CREATE TABLE "genres" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "id" UUID NOT NULL, "name" VARCHAR(255) NOT NULL, CONSTRAINT "genres_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-8
ALTER TABLE "auth_providers" ADD CONSTRAINT "auth_providers_provider_provider_user_id_key" UNIQUE ("provider", "provider_user_id");

-- changeset Professional:1772965297913-9
ALTER TABLE "images" ADD CONSTRAINT "images_path_key" UNIQUE ("path");

-- changeset Professional:1772965297913-10
ALTER TABLE "offers" ADD CONSTRAINT "offers_book_id_key" UNIQUE ("book_id");

-- changeset Professional:1772965297913-11
ALTER TABLE "authors" ADD CONSTRAINT "authors_name_key" UNIQUE ("name");

-- changeset Professional:1772965297913-12
ALTER TABLE "books_images" ADD CONSTRAINT "books_images_path_key" UNIQUE ("path");

-- changeset Professional:1772965297913-13
ALTER TABLE "genres" ADD CONSTRAINT "genres_name_key" UNIQUE ("name");

-- changeset Professional:1772965297913-14
CREATE TABLE "books_authors" ("author_id" UUID NOT NULL, "book_id" UUID NOT NULL);

-- changeset Professional:1772965297913-15
CREATE TABLE "books_genres" ("book_id" UUID NOT NULL, "genre_id" UUID NOT NULL);

-- changeset Professional:1772965297913-16
CREATE TABLE "users" ("created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "last_modified_date" TIMESTAMP WITHOUT TIME ZONE, "id" UUID NOT NULL, "avatar_url" VARCHAR(255), "email" VARCHAR(255) NOT NULL, "name" VARCHAR(255) NOT NULL, "password" VARCHAR(255), "test_field" VARCHAR(255), CONSTRAINT "users_pkey" PRIMARY KEY ("id"));

-- changeset Professional:1772965297913-17
ALTER TABLE "books_authors" ADD CONSTRAINT "fk1b933slgixbjdslgwu888m34v" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-18
ALTER TABLE "books_images" ADD CONSTRAINT "fk1idasmv4m08y4m3usdilrdt0d" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-19
ALTER TABLE "books_authors" ADD CONSTRAINT "fk3qua08pjd1ca1fe2x5cgohuu5" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-20
ALTER TABLE "offers" ADD CONSTRAINT "fk64dv88mu37r6tcmd4cgu5sve" FOREIGN KEY ("seller_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-21
ALTER TABLE "books_genres" ADD CONSTRAINT "fkgkat05y2cec3tcpl6ur250sd0" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-22
ALTER TABLE "books_genres" ADD CONSTRAINT "fklv42b6uemg63q27om39jjbt9o" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-23
ALTER TABLE "auth_providers" ADD CONSTRAINT "fkr4dnktqfoltufkwsbto6bwxq1" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset Professional:1772965297913-24
ALTER TABLE "offers" ADD CONSTRAINT "fkrmgjhhkhcem54y35rgjiche8j" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;

