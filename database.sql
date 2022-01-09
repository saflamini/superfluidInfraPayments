CREATE DATABASE streamingAuth;

CREATE TABLE auth(
    userid SERIAL PRIMARY KEY,
    useraddress VARCHAR(42),
    userkey VARCHAR
)