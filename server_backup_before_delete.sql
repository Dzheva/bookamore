--
-- PostgreSQL database dump
--

\restrict 755yH2LtgbsYv87wgfERJvFbVlBXx92n5II0FpY4aWtyUXVU71uhJdg9UAdghAd

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_providers (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    provider character varying(255) NOT NULL,
    provider_user_id character varying(255) NOT NULL
);


ALTER TABLE public.auth_providers OWNER TO postgres;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    id uuid NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    year_of_release integer NOT NULL,
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    id uuid NOT NULL,
    description character varying(500),
    condition character varying(255) NOT NULL,
    isbn character varying(255),
    title character varying(255) NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books_authors (
    author_id uuid NOT NULL,
    book_id uuid NOT NULL
);


ALTER TABLE public.books_authors OWNER TO postgres;

--
-- Name: books_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books_genres (
    book_id uuid NOT NULL,
    genre_id uuid NOT NULL
);


ALTER TABLE public.books_genres OWNER TO postgres;

--
-- Name: books_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books_images (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    book_id uuid NOT NULL,
    id uuid NOT NULL,
    path character varying(255) NOT NULL
);


ALTER TABLE public.books_images OWNER TO postgres;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    id uuid NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    entity_id uuid,
    id uuid NOT NULL,
    description character varying(500),
    entity_type character varying(255) NOT NULL,
    path character varying(255) NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offers (
    price numeric(10,2),
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    book_id uuid NOT NULL,
    id uuid NOT NULL,
    seller_id uuid NOT NULL,
    description character varying(500),
    status character varying(255) NOT NULL,
    type character varying(255) NOT NULL
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    created_date timestamp without time zone NOT NULL,
    last_modified_date timestamp without time zone,
    id uuid NOT NULL,
    avatar_url character varying(255),
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: auth_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_providers (created_date, last_modified_date, id, user_id, provider, provider_user_id) FROM stdin;
\.


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors (created_date, last_modified_date, id, name) FROM stdin;
2026-04-09 14:51:03.914862	2026-04-09 14:51:03.914862	019d72b9-ab6a-729e-8ff7-c04d3ab080b0	www
2026-04-09 14:52:06.266544	2026-04-09 14:52:06.266544	019d72ba-9efa-7243-a6e1-a12f7695b736	b
2026-04-09 22:07:55.384693	2026-04-09 22:07:55.384693	019d7449-9ff7-7278-b91d-20f0a9ff03f4	Бронте
2026-04-13 15:06:15.755071	2026-04-13 15:06:15.755071	019d8761-054a-7d13-b258-bd2c8cd91a6e	Bronte
2026-04-13 16:16:19.843544	2026-04-13 16:16:19.843544	019d87a1-2b83-7dc2-8e8d-5a4b089cceee	sdv
2026-04-13 16:17:13.841824	2026-04-13 16:17:13.841824	019d87a1-fe71-7aaf-87f5-f6e46d1a9eb6	qw
2026-04-15 18:13:47.63025	2026-04-15 18:13:47.63025	019d9259-6dc9-7dab-8a69-1aadc6c85411	Bobo
2026-04-15 18:15:12.043974	2026-04-15 18:15:12.043974	019d925a-b7ab-7e15-b12d-1a3b7643ccca	some-author
2026-04-16 14:11:22.5249	2026-04-16 14:11:22.5249	019d96a1-d8fc-7053-af4e-0acf7ceca87d	12qw
2026-04-16 14:42:52.04497	2026-04-16 14:42:52.04497	019d96be-ae0c-72af-8cea-15f9e7d5eef0	ww
2026-04-16 21:29:02.4273	2026-04-16 21:29:02.4273	019d9832-8adb-79cb-b609-4c416d780f18	author
2026-04-17 15:56:12.461575	2026-04-17 15:56:12.461575	019d9c28-2f2d-7d32-9ace-296276dc2ab4	Rebecca F. Kuang
2026-04-17 17:52:35.461418	2026-04-17 17:52:35.461418	019d9c92-bc85-73bb-87db-39813446c2d1	Andy Weir
2026-04-17 18:08:01.090797	2026-04-17 18:08:01.090797	019d9ca0-dc42-7f12-ae29-c85d66aa15c3	Edgar Rice Burroughs
2026-04-17 18:20:10.999189	2026-04-17 18:20:10.999189	019d9cab-ff77-78c8-8c00-0218a3b768f8	Suzanne Collins
2026-04-17 18:39:56.333801	2026-04-17 18:39:56.333801	019d9cbe-15ad-75a2-b752-e1a1cfccb49e	Helen Walsh
2026-04-17 18:54:17.720429	2026-04-17 18:54:17.720429	019d9ccb-3a78-7861-9053-3f7df6907e80	Joanne Rowling
2026-04-17 19:12:11.526496	2026-04-17 19:12:11.526496	019d9cdb-9d06-7d6c-b93b-b798246554b2	Эмили Бронте
2026-04-17 21:14:27.90046	2026-04-17 21:14:27.90046	019d9d4b-8ebc-7dc4-8eb4-2ab6b21bc23c	Robert C. Martin
2026-04-20 20:36:31.957546	2026-04-20 20:36:31.957546	019dac9b-e855-74dd-a218-009f8b9c8aac	Isaac Asimov
2026-04-26 11:48:23.270542	2026-04-26 11:48:23.270542	019dc99e-8865-71fc-b234-0b509add535c	w
2026-04-28 10:52:56.746302	2026-04-28 10:52:56.746302	019dd3b8-7e2a-7c8f-957b-9aa3e1a526ce	we
2026-04-28 17:20:52.10227	2026-04-28 17:20:52.10227	019dd51b-a586-79ea-98c1-40a943a248d5	Test author
2026-04-28 19:59:43.078684	2026-04-28 19:59:43.078684	019dd5ad-13d7-7866-ab83-a04e39c26d33	test book image
2026-04-29 14:47:17.47298	2026-04-29 14:47:17.47298	019dd9b5-66e0-7b85-964b-9a835cf1034d	Douglas Noël Adams
2026-05-03 19:48:04.57358	2026-05-03 19:48:04.57358	019def62-373c-7ba2-9e6a-bbaef3b41ddf	bronte
2026-05-05 21:13:36.746367	2026-05-05 21:13:36.746367	019df9fd-3ec6-7715-b530-df7dad7ebe08	rrrr
2026-05-05 21:21:48.893024	2026-05-05 21:21:48.893024	019dfa04-c15c-7c4d-84d5-7656f99d45b2	adasda
2026-05-05 21:32:23.908019	2026-05-05 21:32:23.908019	019dfa0e-71e3-783b-a873-9771e4e5fb89	wer
2026-05-06 16:32:31.641852	2026-05-06 16:32:31.641852	019dfe22-4399-7dcf-92b1-4792c9a87702	dfgdfgd
2026-05-06 18:01:01.956291	2026-05-06 18:01:01.956291	019dfe73-4b03-71ab-b869-f394432a86b2	asdasda
2026-05-07 15:26:26.126694	2026-05-07 15:26:26.126694	019e030c-1d4e-70a3-82be-fb9620f23f50	                        sfcs
2026-05-07 15:28:48.652358	2026-05-07 15:28:48.652358	019e030e-4a0c-79c7-b803-0d1f5d722bb0	sdvsdv
2026-05-07 17:07:47.369691	2026-05-07 17:07:47.369691	019e0368-e829-726c-87e1-3be90dbc38bf	sdfsdf
2026-05-07 17:48:48.79195	2026-05-07 17:48:48.79195	019e038e-7717-7988-9c06-b27acdfba142	asdasd
2026-05-07 19:21:56.516337	2026-05-07 19:21:56.516337	019e03e3-ba24-788f-862b-d5ee6785b24e	ytr
2026-05-07 20:24:57.751115	2026-05-07 20:24:57.751115	019e041d-6c73-7895-aa10-06975e5155c7	1111111111
2026-05-07 20:58:56.508204	2026-05-07 20:58:56.508204	019e043c-887b-75c3-9899-29afeb9a4b95	r
2026-05-07 22:15:58.79533	2026-05-07 22:15:58.79533	019e0483-104b-77a7-8456-af99143e230a	aaa
2026-05-08 13:46:19.759983	2026-05-08 13:46:19.759983	019e07d6-d2ef-77f5-bbb5-005928f749d0	adsasd
2026-05-10 22:08:40.599548	2026-05-10 22:08:40.599548	019e13ef-7497-7ceb-9254-fedecd8086e9	werw
2026-05-11 22:03:28.442611	2026-05-11 22:03:28.442611	019e1911-0d3a-7415-aa52-1c68c2a705f4	Лаймен Фрэнк Баум
2026-05-11 22:48:14.859092	2026-05-11 22:48:14.859092	019e193a-0b0a-7dc3-ade6-cb72dfd0e448	Дэн Браун
2026-05-11 23:20:47.158772	2026-05-11 23:20:47.158772	019e1957-d536-7f60-9d14-fb932d632250	Ребекка Кван
2026-05-12 11:35:49.156896	2026-05-12 11:35:49.156896	019e1bf8-c6a4-7df9-8679-e33115070054	Emily Brontë's
2026-05-12 11:45:19.561884	2026-05-12 11:45:19.561884	019e1c01-7ac9-7c02-adf9-ab366c6efcbf	fgh
2026-05-12 12:17:19.866784	2026-05-12 12:17:19.866784	019e1c1e-c7fa-7ddc-b170-c110d243e973	 Emily Brontë's
2026-05-12 17:43:02.07592	2026-05-12 17:43:02.07592	019e1d48-f88b-7885-a601-8bf8a2d3350c	ash
2026-05-12 20:10:25.263471	2026-05-12 20:10:25.263471	019e1dcf-e86f-786e-af3b-68168e7d1eed	q
2026-05-12 23:10:46.124454	2026-05-12 23:10:46.124454	019e1e75-056c-7406-83a6-1ed2c923df95	sdfsd
2026-05-13 00:21:03.01873	2026-05-13 00:21:03.01873	019e1eb5-5daa-732b-afff-aeb8a72e53a4	awewae
2026-05-13 00:22:05.734661	2026-05-13 00:22:05.734661	019e1eb6-52a6-7d5b-97e1-d974ba7e5783	aweaw
2026-05-13 00:29:06.573726	2026-05-13 00:29:06.573726	019e1ebc-be8d-7b20-aaf4-8cd0f614c0e6	fsdf
2026-05-14 17:01:02.062017	2026-05-14 17:01:02.062017	019e276f-3ced-7a58-ae4d-32c0cdcfc712	David Flanagan
2026-05-16 17:46:22.640011	2026-05-16 17:46:22.640011	019e31e5-782f-749f-b16f-91990cb0eb72	asd
2026-05-18 20:20:43.310272	2026-05-18 20:20:43.310272	019e3cbf-7e8b-7a06-a64e-c43485b532cd	dfgdfg
2026-05-19 10:15:04.772191	2026-05-19 10:15:04.772191	019e3fbb-5f44-7aaa-b553-fad60e937ac1	J.K. Rowling
2026-05-19 20:12:22.510828	2026-05-19 20:12:22.510828	019e41de-366e-7988-8196-99f58eb76d34	Фрэнк Герберт
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (year_of_release, created_date, last_modified_date, id, description, condition, isbn, title) FROM stdin;
2026	2026-05-19 20:12:22.511147	2026-05-21 20:04:41.614869	019e41de-366f-7d3a-9487-9ee78b151e63	The Duke of Atreides has been manoeuvred by his arch-enemy, Baron Harkonnen, into administering the desert planet of Dune. Although it is almost completely without water, Dune is a planet of fabulous wealth, for it is the only source of a drug prized throughout the Galactic Empire. The Duke and his son, Paul, are expecting treachery, and it duly comes - but from a shockingly unexpected place.	NEW		Dune
2026	2026-05-07 23:05:04.652784	2026-05-21 20:40:42.609928	019e04b0-038c-7a3f-b274-3549479b637a	Ryland Grace is the sole survivor on a desperate, last-chance mission - and if he fails, humanity and the earth itself will perish.	NEW		Project Hail Mary
2026	2026-05-12 12:17:19.885458	2026-05-21 21:10:19.955135	019e1c1e-c80d-70ae-a6e8-4743c46758dc		NEW		Wuthering Heights
2026	2026-05-19 10:15:04.782799	2026-05-21 21:12:07.858213	019e3fbb-5f4e-784f-93e2-2a222cea902a		USED		Harry Potter Books in Order: A Chronological Reading Guide
2012	2026-04-29 14:47:17.4909	2026-05-26 15:26:02.90839	019dd9b5-66f2-7205-9a78-c9004a1256a2	One Thursday lunchtime Earth is unexpectedly demolished to make way for a new hyperspace bypass. For Arthur Dent, who has only just had his house demolished that morning, this is already more than he can cope with. Sadly, however, the weekend has only just begun. And the Galaxy is a very, very large and startling place indeed ...	NEW	\N	The Hitchhiker's Guide To The Galaxy
2026	2026-05-14 17:01:02.08043	2026-05-23 20:41:38.723318	019e276f-3d00-7c83-99ed-25e5e5bc9079	JavaScript. Przewodnik. Poznaj język mistrzów programowania. Wydanie VII	USED		JavaScript
2025	2026-05-11 22:31:09.664582	2026-05-11 22:31:09.664582	019e192a-6660-7a41-8818-32edb2c50db8	«Чарівник країни Оз» — відома казкова повість Френка Баума (1856–1919) про дівчинку Дороті та її песика Тото. Через ураган вони потрапляють у Країну Оз, і Дороті вирушає до Чарівника, щоб знайти шлях додому. Дорогою вона зустрічає Страхопуда, Бляшаного Лісоруба та Лякливого Лева, які приєднуються до подорожі й допомагають долати перешкоди.	NEW		Чарівник країни Оз
2026	2026-05-11 22:50:30.092182	2026-05-11 22:50:30.092182	019e193c-1b4b-79c8-b9d3-08392c4402fb	Роберт Ленгдон, професор символіки, приїздить до Праги на лекцію вченої Кетрін Соломон, яка готує книгу про природу людської свідомості. Після жорстокого вбивства Кетрін зникає разом із рукописом, і Ленгдон вирушає на небезпечні пошуки, щоб урятувати її та розкрити таємницю.	USED	9783161484100	Таємниця таємниць
2022	2026-05-11 23:20:47.160359	2026-05-11 23:20:47.160359	019e1957-d538-7ec9-9005-19aac247e198	The city of dreaming spires. It is the centre of all knowledge and progress in the world. And at its centre is Babel, the Royal Institute of Translation. The tower from which all the power of the Empire flows. Orphaned in Canton and brought to England by a mysterious guardian, Babel seemed like paradise to Robin Swift. Until it became a prison... But can a student stand against an empire?	NEW		Babel
2021	2026-05-11 23:30:46.210451	2026-06-20 14:30:06.820822	019e1960-f942-7296-b8b8-fa35707afde7	Abandoned to his fate when his English parents die in the African jungle, a baby boy is rescued and reared by a loving ape foster mother. Conquering the savage laws of the wilderness, Tarzan grows into a mighty warrior and becomes leader of his tribe of apes until he encounters, for the first time, his own kind – humans. An expedition of white treasure hunters has entered his jungle kingdom, accompanied by the beautiful Jane Porter.	USED		Tarzan of the Apes
\.


--
-- Data for Name: books_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books_authors (author_id, book_id) FROM stdin;
019e276f-3ced-7a58-ae4d-32c0cdcfc712	019e276f-3d00-7c83-99ed-25e5e5bc9079
019e3fbb-5f44-7aaa-b553-fad60e937ac1	019e3fbb-5f4e-784f-93e2-2a222cea902a
019d9d4b-8ebc-7dc4-8eb4-2ab6b21bc23c	019e41de-366f-7d3a-9487-9ee78b151e63
019d9c92-bc85-73bb-87db-39813446c2d1	019e04b0-038c-7a3f-b274-3549479b637a
019e1911-0d3a-7415-aa52-1c68c2a705f4	019e192a-6660-7a41-8818-32edb2c50db8
019e193a-0b0a-7dc3-ade6-cb72dfd0e448	019e193c-1b4b-79c8-b9d3-08392c4402fb
019e1957-d536-7f60-9d14-fb932d632250	019e1957-d538-7ec9-9005-19aac247e198
019d9ca0-dc42-7f12-ae29-c85d66aa15c3	019e1960-f942-7296-b8b8-fa35707afde7
019e1c1e-c7fa-7ddc-b170-c110d243e973	019e1c1e-c80d-70ae-a6e8-4743c46758dc
019dd9b5-66e0-7b85-964b-9a835cf1034d	019dd9b5-66f2-7205-9a78-c9004a1256a2
\.


--
-- Data for Name: books_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books_genres (book_id, genre_id) FROM stdin;
019e41de-366f-7d3a-9487-9ee78b151e63	019d9c28-2f3c-7741-b06b-584aab114f52
019e41de-366f-7d3a-9487-9ee78b151e63	019d9c28-2f33-77c8-a409-46314a26baa0
019e04b0-038c-7a3f-b274-3549479b637a	019d9c28-2f33-77c8-a409-46314a26baa0
019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1e75-0570-7997-b508-c388288233ef
019e1c1e-c80d-70ae-a6e8-4743c46758dc	019d9c28-2f3c-7741-b06b-584aab114f52
019e3fbb-5f4e-784f-93e2-2a222cea902a	019d9c28-2f3c-7741-b06b-584aab114f52
019e276f-3d00-7c83-99ed-25e5e5bc9079	019e193a-0b0c-7056-a4b6-dea1778c2cee
019e276f-3d00-7c83-99ed-25e5e5bc9079	019d9c28-2f33-77c8-a409-46314a26baa0
019e192a-6660-7a41-8818-32edb2c50db8	019d9ccb-3a85-7cc0-91b9-ecdf8a5a8043
019e192a-6660-7a41-8818-32edb2c50db8	019d9ca0-dc45-7be2-8b10-7ab9f44275fd
019e192a-6660-7a41-8818-32edb2c50db8	019d9c28-2f3c-7741-b06b-584aab114f52
019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193a-0b0c-7056-a4b6-dea1778c2cee
019e1957-d538-7ec9-9005-19aac247e198	019d9c28-2f3c-7741-b06b-584aab114f52
019e1960-f942-7296-b8b8-fa35707afde7	019d9ca0-dc45-7be2-8b10-7ab9f44275fd
019dd9b5-66f2-7205-9a78-c9004a1256a2	019d9846-50e8-7dcc-b5e2-cf563034e5a1
019dd9b5-66f2-7205-9a78-c9004a1256a2	019d9ca0-dc45-7be2-8b10-7ab9f44275fd
019dd9b5-66f2-7205-9a78-c9004a1256a2	019d9c28-2f33-77c8-a409-46314a26baa0
\.


--
-- Data for Name: books_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books_images (created_date, last_modified_date, book_id, id, path) FROM stdin;
2026-05-11 22:35:27.061715	2026-05-11 22:35:27.061715	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-53d5-73da-9cd5-44a10753b08c	/img/book/e3bd309384e868cb55e608cff60ebdcd1c61c11f0641a774e3e241dab862afb8.jpg
2026-05-11 22:35:52.939267	2026-05-11 22:35:52.939267	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-b8eb-7732-879e-c68b824eff58	/img/book/d6faa169b08c83e77e2790f52f9a9e9492e9cdd9985b3cd0b27b1bcf3f132f7b.jpg
2026-05-11 22:36:01.282226	2026-05-11 22:36:01.282226	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-d982-7b6b-b80e-116ec9b63fd1	/img/book/ca225ae612afbea5ae2f97fb844e27dbbcf931080c5f50b11da23977d35bf52e.jpg
2026-05-11 22:51:41.506686	2026-05-11 22:51:41.506686	019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193d-3242-7cb2-95cd-1d18835caa02	/img/book/c0e7ef812712919dab7632c494609bdb98f0cc8d52082951f13c25c8bfa5eee7.jpeg
2026-05-11 22:51:51.528461	2026-05-11 22:51:51.528461	019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193d-5968-769b-9a77-927cd0214293	/img/book/4b25a60b2bdbb0b554a4eb2c289e99a141db79c5117a81e01e04445ebd6918b2.jpeg
2026-05-11 23:23:13.760741	2026-05-11 23:23:13.760741	019e1957-d538-7ec9-9005-19aac247e198	019e195a-11e0-7df1-85bf-2215e8398170	/img/book/b18fb936f2a027cda832104bcd302149428ac79089ed146e96e4221d94112ff2.jpg
2026-05-11 23:31:40.111584	2026-05-11 23:31:40.111584	019e1960-f942-7296-b8b8-fa35707afde7	019e1961-cbcf-75ea-bca3-7a67251deb69	/img/book/a31065db9e56a1c7cc5252e397bcfdf7a99be6d8a6b16aa0f9838a6ebd6e6f8a.jpg
2026-05-12 12:17:20.340022	2026-05-12 12:17:20.340022	019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1c1e-c9d3-71e2-a156-bcfa118d9bd2	/img/book/7078c386c6fe666851b99580a78a415f992fb26bdac34fd11340161f10cede71.jpg
2026-05-12 12:17:20.590932	2026-05-12 12:17:20.590932	019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1c1e-cace-7e2b-a90e-9f1137f6fb3c	/img/book/d46cf5ccbfdeea8d06971af962b12d853831275a9206fed1b3e636cd8ede6525.jpg
2026-05-14 17:01:02.443533	2026-05-14 17:01:02.443533	019e276f-3d00-7c83-99ed-25e5e5bc9079	019e276f-3e6b-765e-a30c-ef31c3ce44c9	/img/book/a4d08306a64ecaae85ce8945e945cfebb0a0136e66677e64b730aeee84dd4ca8.jpg
2026-05-14 17:01:02.686563	2026-05-14 17:01:02.686563	019e276f-3d00-7c83-99ed-25e5e5bc9079	019e276f-3f5e-731c-8e28-f8a8f6821458	/img/book/aa2f927bfd2b6687d9dbea3b3f65b8f9e2f62727a401e29d6cb0bf78be6498ba.jpg
2026-05-19 10:15:05.415347	2026-05-19 10:15:05.415347	019e3fbb-5f4e-784f-93e2-2a222cea902a	019e3fbb-61c6-7017-867e-5be7f60ed9d5	/img/book/d3026261974f4dfb1c764019329498ff8d05a214d421b1cbeaa4db79ffd1c248.jpg
2026-05-19 20:12:22.838512	2026-05-19 20:12:22.838512	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-37b6-79de-a38a-9deaa354d966	/img/book/26cf1e965c685ad0361707ea911b4705ca33c775fb7d4c93173c932ff6d615be.jpg
2026-05-19 20:12:23.01208	2026-05-19 20:12:23.01208	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-3864-7f18-9cc6-dc532ea1412b	/img/book/2ea9feba4b31573842b6433b18b5d0d58dd64235f928f88f17d3ed609dd8e7ee.jpg
2026-05-19 20:12:23.123916	2026-05-19 20:12:23.123916	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-38d3-76b5-99a2-c70a98475d08	/img/book/7db25d7fecab32c5f5a45012c7ae94b7dbfc5507f2303297a0c881fbdf68c2e6.jpg
2026-04-29 14:49:32.992434	2026-04-29 14:49:32.992434	019dd9b5-66f2-7205-9a78-c9004a1256a2	019dd9b7-7840-7213-b6a7-c83961ea498a	/img/book/42f68be39563d09b723e5287b4a0413c13ab2dfc5cbacf1bf11411686724fe02.jpg
2026-05-07 23:05:04.917154	2026-05-07 23:05:04.917154	019e04b0-038c-7a3f-b274-3549479b637a	019e04b0-0495-7ab6-8f10-0cb4589e7a6b	/img/book/d13a489d895d03480813f8b6de84607f3a852da9d53a1b286c85b27bba6bbf0f.jpg
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1772965297913-1	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.110922	1	EXECUTED	9:b4affff40c2b07b324cdce1e351870c8	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-2	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.145062	2	EXECUTED	9:b55d6dbe5968cd30f345ff7bfdcf21b9	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-3	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.167312	3	EXECUTED	9:2b38d39c6b295acf6a0651c2ae8c5554	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-4	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.200691	4	EXECUTED	9:e0dac50c35522e64fab20ab2540d8cd5	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-5	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.222886	5	EXECUTED	9:96beb9d2edfea86bd5671eea51f710a0	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-6	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.247927	6	EXECUTED	9:7ca6789bcd0ef0e2d4fe4ec32039e1bd	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-7	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.26317	7	EXECUTED	9:c4d3fd716fba12ddad1e7e187a4cc402	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-8	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.276539	8	EXECUTED	9:d2ae8166fb3adcd945983587a196563d	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-9	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.290259	9	EXECUTED	9:972fa081e9713743546238513305f04a	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-10	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.312657	10	EXECUTED	9:0a6627c008fb3de9d2119df4c7460869	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-11	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.327235	11	EXECUTED	9:7d47db95d13044f145a675f8912223a4	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-12	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.343158	12	EXECUTED	9:820487edc5f06e85e9e5dfdf736e86ec	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-13	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.359388	13	EXECUTED	9:f97aa6700a87a4f85644e83877d25a60	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-14	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.371324	14	EXECUTED	9:2417d9efe69f53f8fb1313dc467ff0bd	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-15	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.383992	15	EXECUTED	9:2dbcfbc7b438e5134f51bf998dbb99fc	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-16	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.399926	16	EXECUTED	9:6cda31e9020a4ea1081b1e8e015769d8	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-17	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.423349	17	EXECUTED	9:b601c97be2f5377f9910af4f77a7d8bf	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-18	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.438917	18	EXECUTED	9:b4ff7c1ce22880146f32c9b5f3f4e58c	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-19	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.457644	19	EXECUTED	9:7634886219a81cabc344d95efa7dc602	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-20	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.47716	20	EXECUTED	9:24cd1d198f6ba797d991ed339abaf66a	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-21	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.494727	21	EXECUTED	9:4d9b5cfe1dcf2a365bc896c0a9bf1384	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-22	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.515195	22	EXECUTED	9:b3242dd35646ec9d341c110101a18a62	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-23	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.531012	23	EXECUTED	9:31a7d07119f1beb125f129e2945fb151	sql		\N	4.31.1	\N	\N	3831990730
1772965297913-24	Professional	db/changelog/changes/001_initial.sql	2026-03-18 11:06:33.542424	24	EXECUTED	9:474226dce4ae7d2a61c6549176fff488	sql		\N	4.31.1	\N	\N	3831990730
1772967242726-1	Professional	db/changelog/changes/002_remove_test_field.sql	2026-03-18 11:06:33.557381	25	EXECUTED	9:aeb469727c296cd6589671b3bb3e7d07	sql		\N	4.31.1	\N	\N	3831990730
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (created_date, last_modified_date, id, name) FROM stdin;
2026-04-16 21:50:38.316982	2026-04-16 21:50:38.316982	019d9846-50e8-7dcc-b5e2-cf563034e5a1	comedy
2026-04-17 15:56:12.468351	2026-04-17 15:56:12.468351	019d9c28-2f33-77c8-a409-46314a26baa0	sci-fi
2026-04-17 15:56:12.477177	2026-04-17 15:56:12.477177	019d9c28-2f3c-7741-b06b-584aab114f52	fantasy
2026-04-17 18:08:01.093229	2026-04-17 18:08:01.093229	019d9ca0-dc45-7be2-8b10-7ab9f44275fd	adventure
2026-04-17 18:39:56.335859	2026-04-17 18:39:56.335859	019d9cbe-15af-785c-a8cf-4e0c57226b33	romantic
2026-04-17 18:54:17.733371	2026-04-17 18:54:17.733371	019d9ccb-3a85-7cc0-91b9-ecdf8a5a8043	children
2026-04-17 21:14:27.906618	2026-04-17 21:14:27.906618	019d9d4b-8ec2-703e-81d3-0794df653057	Classic
2026-04-17 21:14:27.915436	2026-04-17 21:14:27.915436	019d9d4b-8ecb-76e7-b08f-73d584f63c23	Novel
2026-05-11 22:48:14.86053	2026-05-11 22:48:14.86053	019e193a-0b0c-7056-a4b6-dea1778c2cee	detective
2026-05-12 11:45:19.563598	2026-05-12 11:45:19.563598	019e1c01-7acb-72f5-98d2-3bdb83d75324	Detective
2026-05-12 11:45:19.573129	2026-05-12 11:45:19.573129	019e1c01-7ad4-7c88-94b4-c001c67e1e36	Sci-Fi
2026-05-12 11:45:19.575965	2026-05-12 11:45:19.575965	019e1c01-7ad7-7cbc-95c3-49233073696c	Thriller
2026-05-12 12:17:19.870435	2026-05-12 12:17:19.870435	019e1c1e-c7fd-7d7f-9065-ba6e9d5ad406	Drama
2026-05-12 12:17:19.884899	2026-05-12 12:17:19.884899	019e1c1e-c80c-74c4-a005-a3585347d9d2	Fantasy
2026-05-12 17:43:02.154209	2026-05-12 17:43:02.154209	019e1d48-f906-7b6f-9ba5-12ddba741bd9	Romance
2026-05-12 17:43:02.223015	2026-05-12 17:43:02.223015	019e1d48-f94e-7c99-883e-c2dda37e9453	Adventure
2026-05-12 17:43:02.23913	2026-05-12 17:43:02.23913	019e1d48-f95e-70b3-9d6c-7826d6085a4f	Horror
2026-05-12 17:43:02.263281	2026-05-12 17:43:02.263281	019e1d48-f977-7c69-8f6e-df2b3c9caa81	Biography
2026-05-12 17:43:02.271705	2026-05-12 17:43:02.271705	019e1d48-f97f-7a78-97e3-a0c0b4e9d88a	History
2026-05-12 17:43:02.294658	2026-05-12 17:43:02.294658	019e1d48-f996-70b0-981b-61a03950e860	Dystopian
2026-05-12 17:43:02.316743	2026-05-12 17:43:02.316743	019e1d48-f9ac-7311-b6d9-c36fff275b74	Comedy
2026-05-12 23:10:46.129422	2026-05-12 23:10:46.129422	019e1e75-0570-7997-b508-c388288233ef	drama
2026-05-13 00:22:05.738675	2026-05-13 00:22:05.738675	019e1eb6-52aa-798b-9c0d-643a5fcf3e5f	biography
2026-05-16 17:46:22.641823	2026-05-16 17:46:22.641823	019e31e5-7831-78f2-a3cc-fe9e40694543	historical
2026-05-23 20:40:57.589501	2026-05-23 20:40:57.589501	019e5691-d1ef-74c6-9918-7ccabf9a0ec3	sci-Fi
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (created_date, last_modified_date, entity_id, id, description, entity_type, path) FROM stdin;
2026-04-21 18:59:53.045996	2026-04-21 18:59:53.045996	019db168-dc41-7322-9184-e6046cafc2db	019db169-c855-7d97-bff5-cdda4529042d	Book cover	BOOK	/img/book/a53a1aec599369cb20f762242c3d93fb4ff0f9c02e976568785bcd7fcc115c2c.jpg
2026-04-21 20:29:18.505169	2026-04-21 20:29:18.505169	019db1ba-a94d-7e74-8e4c-0bfbf449aa0f	019db1bb-a729-7062-b97a-addec8a91d94	Book cover	BOOK	/img/book/f114d86ee850a91583015144764fca1a7f04cb76a01d0f87dd5f054315e7c0cb.jpg
2026-04-22 16:17:50.455428	2026-04-22 16:17:50.455428	019db5fb-1b66-750f-b50d-4e226088afd1	019db5fb-c976-76e9-9e90-e6723dd1b3c2	Book cover	BOOK	/img/book/d6cb0fef4da57c35cb70e8cb84849a26fda68e5dab5dcb1998c60a594ecf6809.jpg
2026-04-26 18:18:36.982789	2026-04-26 18:18:36.982789	019dc99e-886a-7591-afbc-671bbc87d258	019dcb03-cc36-757e-b100-fd7c7491bac2	Book cover	BOOK	/img/book/b0e44106468addd3f09e664b00f880b704d9c242a0534c48e8c48b49f49c0e8a.jpg
2026-04-28 17:26:34.365177	2026-04-28 17:26:34.365177	019dd51b-a586-7798-bda8-c5d2aea96126	019dd520-de7c-7de8-9754-63522a8a9d71	Book cover	BOOK	/img/book/ea215fe9be9fbc5f39140a8e5e2aa07883814d3366fdc7a25e7963f50f33e2c8.jpg
2026-04-28 20:01:40.273977	2026-04-28 20:01:40.273977	019dd5ad-13fb-71c5-825c-21094d686923	019dd5ae-ddb1-7f6a-a61e-4bed4401bf63	Test add book image	BOOK	/img/book/fae18559a18c5026db7031f73d0dbe8859b691c1b49d7413b9fcc33b7653a947.jpg
2026-04-29 14:49:32.989823	2026-04-29 14:49:32.989823	019dd9b5-66f2-7205-9a78-c9004a1256a2	019dd9b7-783d-74a1-bc57-72ab7dec1703	Book cover	BOOK	/img/book/42f68be39563d09b723e5287b4a0413c13ab2dfc5cbacf1bf11411686724fe02.jpg
2026-05-05 17:14:56.07868	2026-05-05 17:14:56.07868	019df922-15ce-7c82-8c8b-50ca57b2b660	019df922-bacd-79e8-b917-e9774f823a8d	Book cover	BOOK	/img/book/f870bb3a8595c31f13df1ecfe782ed8c86e5507fe76d3a12598508c7a113225e.jpg
2026-05-05 21:13:37.090112	2026-05-05 21:13:37.090112	019df9fd-3f02-7313-bd7d-2d9cd6b9155b	019df9fd-4041-7c89-b24f-963a3828072d	\N	BOOK	/img/book/aac41e7987c7e9d817f9a5ffa4f6368f0214a49a7e862e5ca0141608b8a39842.jpg
2026-05-05 21:21:49.127188	2026-05-05 21:21:49.127188	019dfa04-c15d-77ac-8e8a-18588ff5270f	019dfa04-c246-7931-95a7-c29c6c91afe4	\N	BOOK	/img/book/25b185a05c72ad1df850fabb3b5d4ef64fb7847740726a0eeab9fac7f77e87c8.jpg
2026-05-05 21:21:49.42348	2026-05-05 21:21:49.42348	019dfa04-c15d-77ac-8e8a-18588ff5270f	019dfa04-c36f-74a9-bd02-847401453313	\N	BOOK	/img/book/da6fee191ae2b35061209f18cf90046f38d56da8a96d4706a2ef00d8aa9b3826.jpg
2026-05-06 15:42:01.808617	2026-05-06 15:42:01.808617	019dfdf4-07b8-7c84-b4ac-e4b177bb3f81	019dfdf4-084e-7c1b-8342-280fab7be7fe	\N	BOOK	/img/book/028d09aef7906c78c5f384805002e15361c3598ec9416c56cd30908c29e7970d.jpg
2026-05-06 16:17:08.790821	2026-05-06 16:17:08.790821	019dfe14-2e65-7b24-bbc1-e0c0cfbd0ffc	019dfe14-2eb6-7171-9582-cf88fc1ef311	\N	BOOK	/img/book/d038e8579b439d76b83aa99565b7981bd04c8617127687ef84b510261ad9e41e.jpg
2026-05-06 16:32:31.735517	2026-05-06 16:32:31.735517	019dfe22-439a-7abc-a361-e1e69e658124	019dfe22-43f7-7b57-ab30-0403f88f6370	\N	BOOK	/img/book/57ee8563a756ce6cde7a7365188ea286f2af52ce4188cc94ded4f7242771abf2.jpg
2026-05-06 16:32:31.999375	2026-05-06 16:32:31.999375	019dfe22-439a-7abc-a361-e1e69e658124	019dfe22-44ff-7200-acfe-6b093e27163b	\N	BOOK	/img/book/f744b717433fe4a961fb6ff68cb29e1a3f68188097b7b63af1f812eee4bb493b.jpg
2026-05-06 18:01:02.137783	2026-05-06 18:01:02.137783	019dfe73-4b04-766d-b2ec-e548d407be97	019dfe73-4bb9-7baa-a32b-c8b36b4ec04c	\N	BOOK	/img/book/27f819f519129ae48de8b19f2d7fbd86df09f1bed1ab7c8661b406b03d3d54b6.jpg
2026-05-07 17:07:47.460621	2026-05-07 17:07:47.460621	019e0368-e82a-70ab-a2d7-a8a37e9587f6	019e0368-e884-7f0a-bbea-32e26fef248b	\N	BOOK	/img/book/c3977819314b79915eebfaa5de1358491b569d023f2ebb90a33c47e2b100ffd0.jpg
2026-05-07 17:48:48.998689	2026-05-07 17:48:48.998689	019e038e-7718-773e-bf9b-bcac34e81a56	019e038e-77e6-7045-929e-5baf92eb7c01	\N	BOOK	/img/book/29298220e7448bf7baa8ffe74a281606c2abaf4ac70b8ffa3500135d5a48b9fd.jpg
2026-05-07 17:48:49.472432	2026-05-07 17:48:49.472432	019e038e-7718-773e-bf9b-bcac34e81a56	019e038e-79c0-7215-bd42-f5376b56617f	\N	BOOK	/img/book/d9404c4c8d1d78df2c1a7122ef493288365b57d04c0e3655fcfaf01d0418b0b6.jpg
2026-05-07 20:24:58.322593	2026-05-07 20:24:58.322593	019e041d-6cb9-7a73-bd1d-703dec9ba045	019e041d-6ed1-7e85-8191-9ac295cda2dd	\N	BOOK	/img/book/4dd2cec8c50441027a8e3ca4f332face0916f55b8f163709da7bb5c50051a68c.png
2026-05-07 22:15:58.945221	2026-05-07 22:15:58.945221	019e0483-104c-7377-97e2-a1f3758b5d06	019e0483-10e1-7ba9-b71d-24b1ccbd6453	\N	BOOK	/img/book/d76ca820b3205a9c0d95a16e28d3657963b4a73ed91c5d7a4a389c0606abcedc.jpg
2026-05-07 23:05:04.915652	2026-05-07 23:05:04.915652	019e04b0-038c-7a3f-b274-3549479b637a	019e04b0-0493-76bc-92ed-e787d626c73a	\N	BOOK	/img/book/d13a489d895d03480813f8b6de84607f3a852da9d53a1b286c85b27bba6bbf0f.jpg
2026-05-08 13:46:19.838286	2026-05-08 13:46:19.838286	019e07d6-d2f0-7e81-a6d2-e8e428e14385	019e07d6-d33e-7845-8284-b4ce4164af65	\N	BOOK	/img/book/256b4414d8991e4ee343be023a7ef6e4687284283e2ac36905e60508f731f75e.jpg
2026-05-10 22:08:40.763333	2026-05-10 22:08:40.763333	019e13ef-7497-76a8-ba2e-f07f5700b8a3	019e13ef-753b-7efd-9ee1-ffa804fabdbf	\N	BOOK	/img/book/d4015f3a89b8c5468fb7dd8db132a9a3b41b21278faf8c150689fe62942cba88.jpg
2026-05-11 22:24:54.49864	2026-05-11 22:24:54.49864	019e1921-fbf2-7198-9fa3-0c4d7c2271bb	019e1924-ace2-71b9-a621-c514a29f70a9	Book cover	BOOK	/img/book/a03e52e89ea224c34a07bebf75aba9297805b63e3228909940de64512c9178ee.jpg
2026-05-11 22:25:13.536405	2026-05-11 22:25:13.536405	019e1921-fbf2-7198-9fa3-0c4d7c2271bb	019e1924-f740-7e0e-827f-8cf3557c2011	Book cover	BOOK	/img/book/91249edf827d2b263895aa9d8737a95b9a96a3e5a4744a58fa5d926dacdfcf34.jpg
2026-05-11 22:25:19.850264	2026-05-11 22:25:19.850264	019e1921-fbf2-7198-9fa3-0c4d7c2271bb	019e1925-0fe9-7bbf-9cf4-7e3414cc85da	Book cover	BOOK	/img/book/b5981ebcdf1d9725d528d463ee3969320449f58930a22555932238e6e431eb5f.jpg
2026-05-11 22:35:27.060192	2026-05-11 22:35:27.060192	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-53d4-728e-9f6e-1df577711a4c	Book cover	BOOK	/img/book/e3bd309384e868cb55e608cff60ebdcd1c61c11f0641a774e3e241dab862afb8.jpg
2026-05-11 22:35:52.938295	2026-05-11 22:35:52.938295	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-b8ea-7bdf-93fb-70931c1fe5f6	Book cover	BOOK	/img/book/d6faa169b08c83e77e2790f52f9a9e9492e9cdd9985b3cd0b27b1bcf3f132f7b.jpg
2026-05-11 22:36:01.281108	2026-05-11 22:36:01.281108	019e192a-6660-7a41-8818-32edb2c50db8	019e192e-d980-7413-8140-4cd70e2596eb	Book cover	BOOK	/img/book/ca225ae612afbea5ae2f97fb844e27dbbcf931080c5f50b11da23977d35bf52e.jpg
2026-05-11 22:51:41.505235	2026-05-11 22:51:41.505235	019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193d-3241-7cb4-8b67-f4a7ad87f78e	Book cover	BOOK	/img/book/c0e7ef812712919dab7632c494609bdb98f0cc8d52082951f13c25c8bfa5eee7.jpeg
2026-05-11 22:51:51.527048	2026-05-11 22:51:51.527048	019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193d-5966-76d7-a65f-3241c22ae0f6	Book cover	BOOK	/img/book/4b25a60b2bdbb0b554a4eb2c289e99a141db79c5117a81e01e04445ebd6918b2.jpeg
2026-05-11 23:23:13.758973	2026-05-11 23:23:13.758973	019e1957-d538-7ec9-9005-19aac247e198	019e195a-11de-7d8e-89ed-f257b76297da	Book cover	BOOK	/img/book/b18fb936f2a027cda832104bcd302149428ac79089ed146e96e4221d94112ff2.jpg
2026-05-11 23:31:40.110292	2026-05-11 23:31:40.110292	019e1960-f942-7296-b8b8-fa35707afde7	019e1961-cbcc-7624-bc74-93e250509880	Book cover	BOOK	/img/book/a31065db9e56a1c7cc5252e397bcfdf7a99be6d8a6b16aa0f9838a6ebd6e6f8a.jpg
2026-05-12 12:17:20.338993	2026-05-12 12:17:20.338993	019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1c1e-c9d2-7c79-938b-a4d0748f178f	\N	BOOK	/img/book/7078c386c6fe666851b99580a78a415f992fb26bdac34fd11340161f10cede71.jpg
2026-05-12 12:17:20.589902	2026-05-12 12:17:20.589902	019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1c1e-cacd-76c1-a53c-2868c8c40427	\N	BOOK	/img/book/d46cf5ccbfdeea8d06971af962b12d853831275a9206fed1b3e636cd8ede6525.jpg
2026-05-12 17:43:02.572832	2026-05-12 17:43:02.572832	019e1d48-f9ad-7d54-bd55-4fcc9df5df28	019e1d48-faab-7020-a4df-7f2f44ee1112	\N	BOOK	/img/book/1a579e553ad3e3c1cdac531f2ce6643b693f47f3a39c43a149e4c4f6467c8a8c.png
2026-05-12 23:10:46.310645	2026-05-12 23:10:46.310645	019e1e75-0584-709a-b38b-76168444b46e	019e1e75-0626-7480-b651-1cf708140d04	\N	BOOK	/img/book/ed75dab78c573f39bd1701df6c3cc5dbab90092ea528a38e2fbca9ce70871036.jpg
2026-05-13 00:21:03.146981	2026-05-13 00:21:03.146981	019e1eb5-5db2-7221-b622-5040ea7cf9ad	019e1eb5-5e2a-79b9-9a3d-2949dce284b8	\N	BOOK	/img/book/bb261b43cef43c6e038119e1ceb603bd4a7d952a19ef6df9bc59ac5d96df56bf.jpg
2026-05-13 00:22:06.176272	2026-05-13 00:22:06.176272	019e1eb6-52af-7cdd-ba27-d0a7da097c68	019e1eb6-5460-7211-b9bb-8b25268d64af	\N	BOOK	/img/book/8a932d33a32a1ab08c94ce4e69f86009475f55371a0fd578bc292924ce820b08.png
2026-05-14 17:01:02.442126	2026-05-14 17:01:02.442126	019e276f-3d00-7c83-99ed-25e5e5bc9079	019e276f-3e69-7b57-a5de-c9eb408f4f97	\N	BOOK	/img/book/a4d08306a64ecaae85ce8945e945cfebb0a0136e66677e64b730aeee84dd4ca8.jpg
2026-05-14 17:01:02.685041	2026-05-14 17:01:02.685041	019e276f-3d00-7c83-99ed-25e5e5bc9079	019e276f-3f5c-7bcd-8744-098c16c81bdd	\N	BOOK	/img/book/aa2f927bfd2b6687d9dbea3b3f65b8f9e2f62727a401e29d6cb0bf78be6498ba.jpg
2026-05-16 19:03:27.747286	2026-05-16 19:03:27.747286	019e322c-0a5a-7cf7-96af-0cdc6aa1afe5	019e322c-0b03-71a0-9d25-b76332293f8e	\N	BOOK	/img/book/fb7ea7537e3d02d01ec50d53363c64e7247c0fc4c28856d8686abe5e3e0d91a8.jpg
2026-05-16 19:12:51.633408	2026-05-16 19:12:51.633408	019e3234-a1be-78cc-aec6-77e5afc73d17	019e3234-a5b1-7efb-96d7-099a287d21ae	\N	BOOK	/img/book/c646cbfcfec8b0e9c0d1e370af2bb55f75ea5b14efd1f9f2d976a1367fd4cfcd.jpg
2026-05-19 10:15:05.394873	2026-05-19 10:15:05.394873	019e3fbb-5f4e-784f-93e2-2a222cea902a	019e3fbb-61b1-7cd7-b273-492040ecdc6c	\N	BOOK	/img/book/d3026261974f4dfb1c764019329498ff8d05a214d421b1cbeaa4db79ffd1c248.jpg
2026-05-19 20:12:22.837329	2026-05-19 20:12:22.837329	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-37b5-7696-86cf-6c2da9e2a472	\N	BOOK	/img/book/26cf1e965c685ad0361707ea911b4705ca33c775fb7d4c93173c932ff6d615be.jpg
2026-05-19 20:12:23.010638	2026-05-19 20:12:23.010638	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-3862-7922-8ffc-0393c0c9df2b	\N	BOOK	/img/book/2ea9feba4b31573842b6433b18b5d0d58dd64235f928f88f17d3ed609dd8e7ee.jpg
2026-05-19 20:12:23.122136	2026-05-19 20:12:23.122136	019e41de-366f-7d3a-9487-9ee78b151e63	019e41de-38d1-7aa7-b197-a2d4db5eb931	\N	BOOK	/img/book/7db25d7fecab32c5f5a45012c7ae94b7dbfc5507f2303297a0c881fbdf68c2e6.jpg
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (price, created_date, last_modified_date, book_id, id, seller_id, description, status, type) FROM stdin;
876.00	2026-05-14 17:01:02.080879	2026-05-14 17:01:02.080879	019e276f-3d00-7c83-99ed-25e5e5bc9079	019e276f-3d00-7a06-aa8e-f9d03a184eca	019d306d-e3ed-755e-8d84-84fd04d375ea	\N	OPEN	EXCHANGE
700.00	2026-05-19 10:15:04.783266	2026-05-19 10:15:04.783266	019e3fbb-5f4e-784f-93e2-2a222cea902a	019e3fbb-5f4f-7148-9d10-51131f0d1623	019d306d-e3ed-755e-8d84-84fd04d375ea	\N	OPEN	SELL_EXCHANGE
698.00	2026-05-07 23:05:04.654173	2026-05-07 23:05:04.654173	019e04b0-038c-7a3f-b274-3549479b637a	019e04b0-038e-706f-b983-abcdee9f38b5	019dda66-3129-744d-9723-4d02a0140889	\N	OPEN	SELL
930.00	2026-05-11 22:50:30.092847	2026-05-11 22:50:30.092847	019e193c-1b4b-79c8-b9d3-08392c4402fb	019e193c-1b4c-7650-a4b8-81f3590866bc	019d4ada-34e9-7055-b2de-94dba8cbdb29	\N	OPEN	SELL
756.00	2026-05-12 12:17:19.886213	2026-05-12 12:17:19.886213	019e1c1e-c80d-70ae-a6e8-4743c46758dc	019e1c1e-c80e-7411-9633-fb7852996931	019d306d-e3ed-755e-8d84-84fd04d375ea	\N	OPEN	SELL
1194.00	2026-04-29 14:47:17.491373	2026-04-29 14:47:17.491373	019dd9b5-66f2-7205-9a78-c9004a1256a2	019dd9b5-66f3-7713-be2c-36d7cee0576f	019d4ada-34e9-7055-b2de-94dba8cbdb29	\N	OPEN	SELL
557.00	2026-05-11 23:30:46.210951	2026-06-20 14:29:55.260779	019e1960-f942-7296-b8b8-fa35707afde7	019e1960-f942-72d1-b17e-6e0ae4232aae	019d4ada-34e9-7055-b2de-94dba8cbdb29	Abandoned to his fate when his English parents die in the African jungle, a baby boy is rescued and reared by a loving ape foster mother. Conquering the savage laws of the wilderness, Tarzan grows into a mighty warrior and becomes leader of his tribe of apes until he encounters, for the first time, his own kind – humans. An expedition of white treasure hunters has entered his jungle kingdom, accompanied by the beautiful Jane Porter.	OPEN	SELL
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (created_date, last_modified_date, id, avatar_url, email, name, password) FROM stdin;
2026-03-25 12:05:33.33962	2026-03-25 12:05:33.33962	019d24e2-c000-76bb-bf49-c70b66663624	\N	newuser@ggg.com	userNew	$2a$10$x7wb1zvLUdrnlo7tiCnxoeCxWf96kn5rmADLWoC9ka1HR9LLjICwy
2026-03-27 09:43:23.383106	2026-03-27 09:43:23.383106	019d2ead-4ff6-7128-a73f-bd313136931b	\N	5john@example.com	5John Doe	$2a$10$LavH1MfO98p/G8ctaxIqluwNWl1JZY/RFXfnlK4DKh2xs8kespDM2
2026-03-27 17:53:21.389589	2026-03-27 17:53:21.389589	019d306d-e3ed-755e-8d84-84fd04d375ea	\N	qqq@www.com	user	$2a$10$N2WLye35/6JHfeTEevBiqeFcmhndpuAbEywWk/zERsTloq8rhu.fW
2026-04-01 15:39:00.348665	2026-04-01 15:39:00.348665	019d49b2-af61-76ad-aee9-5ea73d818081	\N	dmitriy.snitko@gmail.com	dima	$2a$10$JV6NUOvpmk0hBevXyCDQheoGIAHftSSPHd.FjgYU.TtebR9rWKPLu
2026-04-01 21:01:47.652341	2026-04-01 21:01:47.652341	019d4ada-34e9-7055-b2de-94dba8cbdb29	\N	john.doe@example.com	test1	$2a$10$tvT/jfKMG80j5QRASLR0TetLpFZvZm4FQxScFIH36d9rASerO29Wu
2026-04-02 17:39:31.399714	2026-04-02 17:39:31.399714	019d4f47-61a7-7305-a099-b009bc7eab2f	\N	qqqw@ggg.com	user	$2a$10$9C7mzMJ4xUJpuQ/NNm8WNeE8nNIx6PCK1J2uYRcnK6i/3lrNN/zsK
2026-04-06 11:35:36.369039	2026-04-06 11:35:36.369039	019d6293-a480-766f-ab44-84926bd15bd3	\N	john@example.com	John Doe	$2a$10$bQ6J5m5nd1u5FIO6qpZoje31Xry/VDbZPxdV8vU8Ph1PGOcyVM4qq
2026-04-06 18:06:19.374735	2026-04-06 18:06:19.374735	019d63f9-5aee-74c2-b281-9a7571212214	\N	test@gmail.com	Test	$2a$10$.RunoJLQASc1ZlHW3phQ3.hwEYkrPVBbNMY0j5lmBZW6Pql0r3Rma
2026-04-16 14:40:54.205536	2026-04-16 14:40:54.205536	019d96bc-e1b6-715f-901a-f1cc32f9996f	\N	aaa@sss.com	us	$2a$10$lDrRE8wqNMW90LqHQZOt9u5cZIS0zRiGRIdWWf7al0uvfvJ28lPni
2026-04-17 20:23:49.490787	2026-04-17 20:23:49.490787	019d9d1d-31d6-7613-bd1d-039f07614276	\N	ilmat@mail.com	ilmat	$2a$10$2XOHaS5ypflKMWKhHk8ZFO/9OfzsuPKqxR5J.MJ./5oOQp/XvyiHG
2026-04-18 19:43:15.385062	2026-04-18 19:43:15.385062	019da21e-69b8-7569-8706-400df03a320f	\N	mail@mail.com	Name	$2a$10$iRHkA0bfcPmfJ1f8kOQoauTOrXkgkw.BeOERmTMCIK68l1cNhSznW
2026-04-27 16:25:53.453709	2026-04-27 16:25:53.453709	019dcfc2-f426-799a-9eab-308ee32dfbd8	\N	email@gmail.com	Name	$2a$10$fkWtThKwwvUaGiHTDjqhjOb8tJenZZQYPllSPY8usyCU7g/sWDK7e
2026-04-27 18:29:25.908357	2026-04-27 18:29:25.908357	019dd034-0f14-7989-9bc2-dd09b36595b0	\N	1@mail.com	wqweq	$2a$10$k2Q3zXEK3KX5RfJwfXHCouLrOSEpl2L666lFT3aLO.fcp/ssOCffq
2026-04-27 19:16:20.049182	2026-04-27 19:16:20.049182	019dd05e-ffd1-7522-92be-6ac69299ea9b	\N	dmitriy.sn3itko@gmail.com	Дмитро Снітко	$2a$10$.Kd4sGJOGv7K4puSTbsJXeoVawul/8sCPz1iwjgwh18TMbTYT4EvG
2026-04-27 19:27:19.511374	2026-04-27 19:27:19.511374	019dd069-0fd7-73f1-80da-54370788a2b6	\N	2@mail.com	Name	$2a$10$VfQxGNhiEAy75Xd7yMoLZ.bPek601LXljJ3cefAx5pwHnGVfvGu2y
2026-04-27 19:30:13.967859	2026-04-27 19:30:13.967859	019dd06b-b94f-79f2-9936-c55264d74152	\N	3@mail.com	qqq	$2a$10$urWcws/QbKDs/vqhrfZ.oORJLVyD3DdPp8xXA3bOSTNJcuN6/t2VC
2026-04-27 19:50:08.763553	2026-04-27 19:50:08.763553	019dd07d-f47b-75c1-991e-4e2ab0f681d2	\N	4@mail.com	Дмитро Снітко	$2a$10$tBFUEv47vE6aX95V924DbeQk.1LlB83adk5/72wzRWS5LHLd0SejG
2026-04-27 19:55:15.60094	2026-04-27 19:55:15.60094	019dd082-a310-7966-9dab-1a50c4885522	\N	5@mail.com	Дмитро Снітко	$2a$10$Ba36VolIt3C.PW.hsi5gseeiWnHjFASVnen./M6imGtXUPUyaHZNm
2026-04-27 19:58:38.402649	2026-04-27 19:58:38.402649	019dd085-bb42-7861-83aa-1377dd2d9801	\N	6@mail.com	Name	$2a$10$kNkCET66SF4tes8ucJimFus8nlmldAdEXmE3smt1u8hiNkrmNPPki
2026-04-29 18:00:23.599284	2026-04-29 18:00:23.599284	019dda66-3129-744d-9723-4d02a0140889	\N	name@mail.com	Name	$2a$10$xjGJo4DicfKL6DGKHUILD.jDF/i.SY4lpZ77bSTf5UhOIulM8KF2.
2026-04-29 22:20:40.204589	2026-04-29 22:20:40.204589	019ddb54-7b8c-758b-bb2a-e5ede1236682	\N	111@mail.com	da	$2a$10$ffb7SVOGpZ46CNiL77VSd./V4uAI5e89C/uU8sVjqu24bqnwkjLse
2026-05-03 22:42:59.964482	2026-05-03 22:42:59.964482	019df002-5cfa-71fa-b8b3-1012b3d46b6f	\N	dmitriy.snitko@mail.com	q2	$2a$10$XK6WNTposLUecmQMaKaj/utIMZpTMH5.0g5ZONqfa08hhmOBjESeq
2026-05-19 20:07:23.004184	2026-05-19 20:07:23.004184	019e41d9-a479-7715-9e60-484368160eda	\N	dmitriy@mail.com	Дмитро Снітко	$2a$10$cW1FVGFI413FSGTPxI2wLOnH9yHgvEDVM9PIff7wBzqbYCLm9lC0u
2026-05-24 13:48:20.763152	2026-05-24 13:48:20.763152	019e5a3e-6b9b-7524-b9b1-f1072231a12d	\N	john409@example.com	Test 409 code	$2a$10$nJOcShjLXMNzuV2aNFIqqOj5A5ueaRzli2tMXkkcwaLc2Pv0.CAJa
\.


--
-- Name: auth_providers auth_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT auth_providers_pkey PRIMARY KEY (id);


--
-- Name: auth_providers auth_providers_provider_provider_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT auth_providers_provider_provider_user_id_key UNIQUE (provider, provider_user_id);


--
-- Name: authors authors_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_name_key UNIQUE (name);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: books_images books_images_path_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_images
    ADD CONSTRAINT books_images_path_key UNIQUE (path);


--
-- Name: books_images books_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_images
    ADD CONSTRAINT books_images_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: images images_path_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_path_key UNIQUE (path);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: offers offers_book_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_book_id_key UNIQUE (book_id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: auth_providers uk1iq2uqfy08tccnp6yfubha5gj; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT uk1iq2uqfy08tccnp6yfubha5gj UNIQUE (provider, provider_user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: books_authors fk1b933slgixbjdslgwu888m34v; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_authors
    ADD CONSTRAINT fk1b933slgixbjdslgwu888m34v FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: books_images fk1idasmv4m08y4m3usdilrdt0d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_images
    ADD CONSTRAINT fk1idasmv4m08y4m3usdilrdt0d FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: books_authors fk3qua08pjd1ca1fe2x5cgohuu5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_authors
    ADD CONSTRAINT fk3qua08pjd1ca1fe2x5cgohuu5 FOREIGN KEY (author_id) REFERENCES public.authors(id);


--
-- Name: offers fk64dv88mu37r6tcmd4cgu5sve; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk64dv88mu37r6tcmd4cgu5sve FOREIGN KEY (seller_id) REFERENCES public.users(id);


--
-- Name: books_genres fkgkat05y2cec3tcpl6ur250sd0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_genres
    ADD CONSTRAINT fkgkat05y2cec3tcpl6ur250sd0 FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- Name: books_genres fklv42b6uemg63q27om39jjbt9o; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books_genres
    ADD CONSTRAINT fklv42b6uemg63q27om39jjbt9o FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: auth_providers fkr4dnktqfoltufkwsbto6bwxq1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT fkr4dnktqfoltufkwsbto6bwxq1 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: offers fkrmgjhhkhcem54y35rgjiche8j; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fkrmgjhhkhcem54y35rgjiche8j FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 755yH2LtgbsYv87wgfERJvFbVlBXx92n5II0FpY4aWtyUXVU71uhJdg9UAdghAd

