CREATE DATABASE mywallet;

CREATE TABLE users (id SERIAL, name TEXT, email TEXT, password TEXT);

CREATE TABLE sessions (id SERIAL, "userId" INTEGER, token UUID);

CREATE TABLE transactions (id SERIAL, "userId" INTEGER, description TEXT, value MONEY, type TEXT, date DATE);

INSERT INTO sessions ("userId", token) VALUES (1, 'cc0e39a2-678d-415a-86fd-e37d469ebc2c');

INSERT INTO users (name, email, password) VALUES ('Luis Felipe senha 12345', 'luis@email.com', '$2b$10$zgTu5WtW79kENSkhLADvu.dGam2XjQJ0j.ajW.5UTp8Wr.OFNt3lG');

INSERT INTO transactions ("userId", description, value, type, date) VALUES (1, 'Recebimento', 300.5, 'income', '2021-10-25');

INSERT INTO transactions ("userId", description, value, type, date) VALUES (1, 'Pagamento', 100, 'outcome', '2021-10-26');