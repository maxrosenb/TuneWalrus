CREATE TABLE public.users (
    username character varying(25) NOT NULL,
    id uuid NOT NULL,
    num_songs_played bigint NOT NULL,
    discord_id character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;