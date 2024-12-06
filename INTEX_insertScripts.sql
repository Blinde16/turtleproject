-- Insert data into Users table
INSERT INTO Users (UserName, Password, Email)
VALUES
    ('johndoe', 'password123', 'johndoe@example.com'),
    ('janedoe', 'password456', 'janedoe@example.com');
	
-- Insert data into HeardAbout table
INSERT INTO HeardAbout (Description)
VALUES
    ('Social Media'),
    ('Word of Mouth'),
    ('Sponsor'),
    ('Newsletter');

-- Insert data into SewingLevel table
INSERT INTO SewingLevel (Description)
VALUES
    ('Beginner'),
    ('Intermediate'),
    ('Advanced');

-- Insert data into SewingPreference table
INSERT INTO SewingPreference (Description)
VALUES
    ('Sewing'),
    ('Non-Sewing'),
    ('Both');

-- Insert data into EventStatus table
INSERT INTO EventStatus (Description)
VALUES
    ('Scheduled'),
    ('Completed'),
    ('Cancelled');

-- Insert data into Items table
INSERT INTO Items (ItemName)
VALUES
    ('Pockets'),
    ('Collars'),
    ('Envelopes'),
    ('Vests');

-- Address Table Generation
WITH RECURSIVE address_data(street, city, state, zip, space_size, row_num) AS (
    SELECT '123 Main St', 'Springfield', 'IL', '62704', 'Large Church Gym', 1
    UNION ALL
    SELECT 
        CONCAT(
            CASE row_num % 5
                WHEN 0 THEN CONCAT(row_num, ' Oak Lane')
                WHEN 1 THEN CONCAT(row_num, ' Pine Street')
                WHEN 2 THEN CONCAT(row_num, ' Maple Drive')
                WHEN 3 THEN CONCAT(row_num, ' Elm Court')
                ELSE CONCAT(row_num, ' Cedar Road')
            END
        ),
        CASE row_num % 5
            WHEN 0 THEN 'Provo'
            WHEN 1 THEN 'Orem'
            WHEN 2 THEN 'Salt Lake City'
            WHEN 3 THEN 'Ogden'
            ELSE 'Park City'
        END,
        'UT',
        CONCAT('8', LPAD(CAST((4000 + row_num) AS TEXT), 3, '0')),
        CASE row_num % 5
            WHEN 0 THEN 'Community Center'
            WHEN 1 THEN 'Local Church'
            WHEN 2 THEN 'School Gymnasium'
            WHEN 3 THEN 'City Hall'
            ELSE 'Recreation Center'
        END,
        row_num + 1
    FROM address_data
    WHERE row_num < 100
)
-- Insert Addresses
INSERT INTO Address (StreetAddress, City, State, Zip, SpaceSize)
SELECT street, city, state, zip, space_size
FROM address_data 
WHERE row_num > 1;

-- Event Contacts Generation
WITH RECURSIVE contacts_data(first_name, last_name, phone, address_id, row_num) AS (
    SELECT 'Alice', 'Brown', '5551234', 1, 1
    UNION ALL
    SELECT 
        CASE row_num % 10
            WHEN 0 THEN 'Emma'
            WHEN 1 THEN 'Olivia'
            WHEN 2 THEN 'Sophia'
            WHEN 3 THEN 'Isabella'
            WHEN 4 THEN 'Ava'
            WHEN 5 THEN 'Mia'
            WHEN 6 THEN 'Charlotte'
            WHEN 7 THEN 'Amelia'
            WHEN 8 THEN 'Harper'
            ELSE 'Evelyn'
        END,
        CASE row_num % 10
            WHEN 0 THEN 'Rodriguez'
            WHEN 1 THEN 'Martinez'
            WHEN 2 THEN 'Garcia'
            WHEN 3 THEN 'Lopez'
            WHEN 4 THEN 'Gonzalez'
            WHEN 5 THEN 'Wilson'
            WHEN 6 THEN 'Anderson'
            WHEN 7 THEN 'Taylor'
            WHEN 8 THEN 'Thomas'
            ELSE 'Harris'
        END,
        CONCAT('801', LPAD(CAST((5550000 + row_num) AS TEXT), 4, '0')),
        (row_num % 99) + 1,
        row_num + 1
    FROM contacts_data
    WHERE row_num < 100
)
-- Insert Event Contacts
INSERT INTO EventContacts (Contact_First, Contact_Last, ContactPhone, AddressID)
SELECT first_name, last_name, phone, address_id
FROM contacts_data 
WHERE row_num > 1;

-- Volunteer Generation
WITH RECURSIVE volunteer_data(first_name, last_name, email, phone, heard_about, hours, sewing_level, sewing_pref, address_id, row_num) AS (
    SELECT 'John', 'Smith', 'johnsmith@example.com', '1234567890', 1, 10, 2, 1, 1, 1
    UNION ALL
    SELECT 
        CASE row_num % 10
            WHEN 0 THEN 'Emily'
            WHEN 1 THEN 'Michael'
            WHEN 2 THEN 'Jessica'
            WHEN 3 THEN 'David'
            WHEN 4 THEN 'Sarah'
            WHEN 5 THEN 'Daniel'
            WHEN 6 THEN 'Lisa'
            WHEN 7 THEN 'Matthew'
            WHEN 8 THEN 'Jennifer'
            ELSE 'Christopher'
        END,
        CASE row_num % 10
            WHEN 0 THEN 'Rodriguez'
            WHEN 1 THEN 'Johnson'
            WHEN 2 THEN 'Williams'
            WHEN 3 THEN 'Brown'
            WHEN 4 THEN 'Jones'
            WHEN 5 THEN 'Garcia'
            WHEN 6 THEN 'Miller'
            WHEN 7 THEN 'Davis'
            WHEN 8 THEN 'Martinez'
            ELSE 'Anderson'
        END,
        CONCAT(
            LOWER(
                CASE row_num % 10
                    WHEN 0 THEN 'emily'
                    WHEN 1 THEN 'michael'
                    WHEN 2 THEN 'jessica'
                    WHEN 3 THEN 'david'
                    WHEN 4 THEN 'sarah'
                    WHEN 5 THEN 'daniel'
                    WHEN 6 THEN 'lisa'
                    WHEN 7 THEN 'matthew'
                    WHEN 8 THEN 'jennifer'
                    ELSE 'christopher'
                END
            ),
            row_num,
            '@example.',
            CASE row_num % 3 
                WHEN 0 THEN 'com' 
                WHEN 1 THEN 'org' 
                ELSE 'net' 
            END
        ),
        CONCAT('801', LPAD(CAST((5550000 + row_num) AS TEXT), 4, '0')),
        (row_num % 4) + 1,
        (row_num % 20) + 5,
        (row_num % 3) + 1,
        (row_num % 3) + 1,
        (row_num % 99) + 1,
        row_num + 1
    FROM volunteer_data
    WHERE row_num < 100
)
-- Insert Volunteers
INSERT INTO Volunteer (First_Name, Last_Name, Email, Phone_Number, HeardAboutID, HoursPerMonth, SewingLevelID, SewingPreferenceID, AddressID)
SELECT first_name, last_name, email, phone, heard_about, hours, sewing_level, sewing_pref, address_id
FROM volunteer_data 
WHERE row_num > 1;

-- Manually Insert 50 Event Records
INSERT INTO Events (EventDate, AddressID, ContactID, TotalProduced, Participants, SewingPref, StartTime, Duration, JenStory, EventStatus, Details)
VALUES
('2024-12-15', 1, 1, 100, 25, 1, '08:00', '02:00:00', TRUE, 1, 'BYU Campus'),
('2024-12-22', 2, 2, 110, 30, 2, '08:00', '02:00:00', TRUE, 2, 'Provo Recreation Center'),
('2024-12-29', 3, 3, 120, 35, 1, '08:00', '02:00:00', TRUE, 1, 'Salt Lake City Library'),
('2025-01-05', 4, 4, 130, 40, 2, '08:00', '02:00:00', TRUE, 2, 'Park City Community Center'),
('2025-01-12', 5, 5, 140, 45, 1, '08:00', '02:00:00', TRUE, 1, 'Orem Senior Center'),
('2025-01-19', 6, 6, 150, 50, 2, '08:00', '02:00:00', TRUE, 2, 'West Valley Convention Center'),
('2025-01-26', 7, 7, 160, 55, 1, '08:00', '02:00:00', TRUE, 1, 'Lehi Outdoor Pavilion'),
('2025-02-02', 8, 8, 170, 60, 2, '08:00', '02:00:00', TRUE, 2, 'Sandy Civic Center'),
('2025-02-09', 9, 9, 180, 65, 1, '08:00', '02:00:00', TRUE, 1, 'Murray Arts Center'),
('2025-02-16', 10, 10, 190, 70, 2, '08:00', '02:00:00', TRUE, 2, 'Draper High School'),
('2025-02-23', 11, 11, 200, 75, 1, '08:00', '02:00:00', TRUE, 1, 'Taylorsville Event Hall'),
('2025-03-02', 12, 12, 210, 80, 2, '08:00', '02:00:00', TRUE, 2, 'South Jordan Library'),
('2025-03-09', 13, 13, 220, 85, 1, '08:00', '02:00:00', TRUE, 1, 'Salt Lake City Center'),
('2025-03-16', 14, 14, 230, 90, 2, '08:00', '02:00:00', TRUE, 2, 'North Salt Lake Community Room'),
('2025-03-23', 15, 15, 240, 95, 1, '08:00', '02:00:00', TRUE, 1, 'Kearns Recreation Center'),
('2025-03-30', 16, 16, 250, 100, 2, '08:00', '02:00:00', TRUE, 2, 'Farmington Civic Center'),
('2025-04-06', 17, 17, 260, 105, 1, '08:00', '02:00:00', TRUE, 1, 'Bountiful Events Center'),
('2025-04-13', 18, 18, 270, 110, 2, '08:00', '02:00:00', TRUE, 2, 'Ogden Community Hall'),
('2025-04-20', 19, 19, 280, 115, 1, '08:00', '02:00:00', TRUE, 1, 'Spanish Fork High School'),
('2025-04-27', 20, 20, 290, 120, 2, '08:00', '02:00:00', TRUE, 2, 'Cottonwood Heights Center'),
('2025-05-04', 21, 21, 300, 125, 1, '08:00', '02:00:00', TRUE, 1, 'American Fork Library'),
('2025-05-11', 22, 22, 310, 130, 2, '08:00', '02:00:00', TRUE, 2, 'Eagle Mountain Event Space'),
('2025-05-18', 23, 23, 320, 135, 1, '08:00', '02:00:00', TRUE, 1, 'Pleasant Grove Town Hall'),
('2025-05-25', 24, 24, 330, 140, 2, '08:00', '02:00:00', TRUE, 2, 'Herriman Arts Center'),
('2025-06-01', 25, 25, 340, 145, 1, '08:00', '02:00:00', TRUE, 1, 'Bluffdale City Hall'),
('2025-06-08', 26, 26, 350, 150, 2, '08:00', '02:00:00', TRUE, 2, 'West Jordan Sports Complex'),
('2025-06-15', 27, 27, 360, 155, 1, '08:00', '02:00:00', TRUE, 1, 'Midvale Community Room'),
('2025-06-22', 28, 28, 370, 160, 2, '08:00', '02:00:00', TRUE, 2, 'Springville Civic Center'),
('2025-06-29', 29, 29, 380, 165, 1, '08:00', '02:00:00', TRUE, 1, 'Clearfield Event Hall'),
('2025-07-06', 30, 30, 390, 170, 2, '08:00', '02:00:00', TRUE, 2, 'Tooele Community Center'),
('2025-07-13', 31, 31, 400, 175, 1, '08:00', '02:00:00', TRUE, 1, 'South Ogden Library'),
('2025-07-20', 32, 32, 410, 180, 2, '08:00', '02:00:00', TRUE, 2, 'Holladay Civic Center'),
('2025-07-27', 33, 33, 420, 185, 1, '08:00', '02:00:00', TRUE, 1, 'Timpanogos High School'),
('2025-08-03', 34, 34, 430, 190, 2, '08:00', '02:00:00', TRUE, 2, 'Saratoga Springs Center'),
('2025-08-10', 35, 35, 440, 195, 1, '08:00', '02:00:00', TRUE, 1, 'Lindon Senior Center'),
('2025-08-17', 36, 36, 450, 200, 2, '08:00', '02:00:00', TRUE, 2, 'North Ogden Event Hall'),
('2025-08-24', 37, 37, 460, 205, 1, '08:00', '02:00:00', TRUE, 1, 'Woods Cross Civic Center'),
('2025-08-31', 38, 38, 470, 210, 2, '08:00', '02:00:00', TRUE, 2, 'Centerville Events Room'),
('2025-09-07', 39, 39, 480, 215, 1, '08:00', '02:00:00', TRUE, 1, 'Clinton City Hall'),
('2025-09-14', 40, 40, 490, 220, 2, '08:00', '02:00:00', TRUE, 2, 'Harrisville Community Center'),
('2025-09-21', 41, 41, 500, 225, 1, '08:00', '02:00:00', TRUE, 1, 'Riverdale Library'),
('2025-09-28', 42, 42, 510, 230, 2, '08:00', '02:00:00', TRUE, 2, 'Mountain Green Hall'),
('2025-10-05', 43, 43, 520, 235, 1, '08:00', '02:00:00', TRUE, 1, 'Willard Senior Center'),
('2025-10-12', 44, 44, 530, 240, 2, '08:00', '02:00:00', TRUE, 2, 'Perry City Event Hall'),
('2025-10-19', 45, 45, 540, 245, 1, '08:00', '02:00:00', TRUE, 1, 'Kaysville Recreation Center'),
('2025-10-26', 46, 46, 550, 250, 2, '08:00', '02:00:00', TRUE, 2, 'Clearfield Senior Center'),
('2025-11-02', 47, 47, 560, 255, 1, '08:00', '02:00:00', TRUE, 1, 'Park City Event Space'),
('2025-11-09', 48, 48, 570, 260, 2, '08:00', '02:00:00', TRUE, 2, 'South Weber Hall'),
('2025-11-16', 49, 49, 580, 265, 1, '08:00', '02:00:00', TRUE, 1, 'Morgan Civic Center'),
('2025-11-23', 50, 50, 590, 270, 2, '08:00', '02:00:00', TRUE, 2, 'Eden Community Center');

-- Insert data into ItemsProduced table
INSERT INTO ItemsProduced (EventID, ItemID, Quantity) 
VALUES
    (1, 1, 100),
    (1, 2, 150),
    (1, 3, 200),
    (2, 1, 120),
    (2, 4, 180),
    (3, 2, 130),
    (3, 5, 160),
    (4, 3, 140),
    (4, 1, 110),
    (5, 2, 170),
    (5, 5, 190),
    (6, 4, 160),
    (6, 3, 150),
    (7, 1, 140),
    (7, 5, 180),
    (8, 2, 160),
    (9, 4, 200),
    (9, 1, 130),
    (10, 3, 150),
    (10, 4, 140);
