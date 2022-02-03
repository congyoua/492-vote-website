--- psql "dbname='testdb' user='postgres' password='password' host='localhost'" -f schema.sql
--- COPY images FROM '/tmp/images.csv' DELIMITER E',' CSV HEADER;
---COPY orders FROM '/tmp/order.csv' DELIMITER E',' CSV HEADER;
DROP TABLE userid CASCADE;
DROP TABLE votes CASCADE;
DROP TABLE images CASCADE;

CREATE TABLE userid (
	id SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE votes (
	id SERIAL PRIMARY KEY,
	choice VARCHAR(10) NOT NULL,
	"left" VARCHAR NOT NULL,
	"right" VARCHAR NOT NULL,
	study_id VARCHAR NOT NULL,
	timestamp VARCHAR NOT NULL,
 	voter_uniqueid VARCHAR NOT NULL,
	CHECK ((choice = 'left' OR choice = 'right') OR choice = 'equal')
);


CREATE TABLE images (
	id INT PRIMARY KEY,
	file_name VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
	id INT PRIMARY KEY,
	file_name1 VARCHAR(255) NOT NULL,
	file_name2 VARCHAR(255) NOT NULL
);

COPY images FROM '/tmp/images.csv' DELIMITER E',' CSV HEADER;
COPY orders FROM '/tmp/order.csv' DELIMITER E',' CSV HEADER;