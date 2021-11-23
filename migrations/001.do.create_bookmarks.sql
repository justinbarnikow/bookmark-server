CREATE TYPE star_rating AS ENUM ('1','2','3','4','5');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bookmarks(
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    rating star_rating NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);