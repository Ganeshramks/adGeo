USE adgeo;

DROP TABLE IF EXISTS advertisements;
DROP TABLE IF EXISTS clients;

CREATE TABLE IF NOT EXISTS clients(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS advertisements(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
clientId INT NOT NULL,
FOREIGN KEY (clientId) REFERENCES clients(id),
mediaType ENUM('img', 'video') DEFAULT 'img',
locationBased INT NOT NULL DEFAULT 0, #0 for not location based and 1 for location based
latitude DOUBLE DEFAULT NULL,
longitude DOUBLE DEFAULT NULL,
duration INT NOT NULL DEFAULT 0,
filename VARCHAR(500)
);