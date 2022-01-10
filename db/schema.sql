--- psql "dbname='testdb' user='postgres' password='password' host='localhost'" -f schema.sql
--- COPY votes FROM '/tmp/votes.tsv' DELIMITER E'\t' CSV HEADER;
DROP TABLE userid CASCADE;
DROP TABLE votes CASCADE;
DROP TABLE images CASCADE;
CREATE TABLE userid (
	useid VARCHAR(20) PRIMARY KEY NOT NULL
);

CREATE TABLE votes (
	id VARCHAR PRIMARY KEY NOT NULL,
	choice VARCHAR(10) NOT NULL,
	"left" VARCHAR NOT NULL,
	"right" VARCHAR NOT NULL,
	study_id VARCHAR NOT NULL,
	timestamp VARCHAR NOT NULL,
 	voter_uniqueid VARCHAR NOT NULL,
	CHECK ((choice = 'left' OR choice = 'right') OR choice = 'equal')
);

CREATE TABLE images (
	id VARCHAR PRIMARY KEY NOT NULL, 
	image_name VARCHAR(255) DEFAULT NULL
);

INSERT INTO userid VALUES('aaa');
INSERT INTO images VALUES('1', '1');
INSERT INTO images VALUES('2', '2');
INSERT INTO images VALUES('3', '3');
