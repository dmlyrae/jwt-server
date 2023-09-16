-- STEP 1
-- Create Database

-- DROP DATABASE IF EXISTS;

CREATE DATABASE /* Database Name */
    WITH
    OWNER = /* postgres username */
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- STEP 2
-- Create Table: token

-- DROP TABLE IF EXISTS public.token;

CREATE TABLE IF NOT EXISTS public.token
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    "user" integer NOT NULL,
    "refreshToken" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_unique UNIQUE ("user"),
    CONSTRAINT token_user_fkey FOREIGN KEY ("user")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_fk FOREIGN KEY ("user")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.token
    OWNER to /* postgres username */;

-- STEP 3
-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    email character varying(200) COLLATE pg_catalog."default",
    "isActive" boolean DEFAULT false,
    "firstName" character varying(100) COLLATE pg_catalog."default",
    "lastName" character varying(100) COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default" NOT NULL,
    "activationLink" character varying COLLATE pg_catalog."default",
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to /* postgres username */;

