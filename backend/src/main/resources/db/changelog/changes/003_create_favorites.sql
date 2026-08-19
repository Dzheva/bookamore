-- liquibase formatted sql

-- changeset Professional:003-create-favorites
CREATE TABLE "favorites" (
    "user_id" UUID NOT NULL,
    "offer_id" UUID NOT NULL,
    "created_date" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id", "offer_id")
);

ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_user"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_offer"
    FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
