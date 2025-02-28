-- Drop the database if it exists
-- source C:\Users\suviw\Desktop\developer\MyHealthDiary\MyHealthDiary-Back\db\MyHealthDiary.sql



DROP DATABASE IF EXISTS MyHealthDiary;
CREATE DATABASE MyHealthDiary;

USE MyHealthDiary;


CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) DEFAULT 'regular'
);


CREATE TABLE ActivityLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned DECIMAL(6,2),
    intensity VARCHAR(50),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE MenstrualCycle (
    cycle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    start_date DATE NOT NULL, -- aloituspäivä pakollinen, jotta kiertoja yms voi laskea
    end_date DATE, -- ei pakollinen, täytetään vasta kierron loputtua
    cycle_length INT,  -- Päivien määrä edellisistä kuukautisista, lasketaan ens_date-start_date perusteella
    ovulation_date DATE,  -- Laskennallinen ovulaatiopäivä
    symptoms TEXT,  -- Käyttäjän syöttämät oireet
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- testataan että tietokantayhteys toimii
INSERT INTO Users (username, password, email, created_at, user_level) VALUES
('johndoe', 'hashed_password', 'johndoe@example.com', '2024-01-01 09:00:00', 'regular');
