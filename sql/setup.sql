-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tasks;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL
);

CREATE TABLE tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task VARCHAR,
    completed BOOLEAN,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users(
  first_name,
  last_name,
  email,
  password_hash
)
VALUES
('Colter', 'Garrison', 'test@email.com', 'password');

INSERT INTO tasks (task, completed, user_id) VALUES
('Write README', false, '1'),
('Make 5 LinkedIn connections', true, '1'),
('Write R E T R O', false, '1');