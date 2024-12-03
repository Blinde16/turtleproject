-- Insert data into Users table
INSERT INTO Users (UserName, Password, Email)
VALUES
    ('johndoe', 'password123', 'johndoe@example.com'),
    ('janedoe', 'password456', 'janedoe@example.com');
-- Insert data into Address table
INSERT INTO Address (StreetAddress, City, State, Zip, SpaceSize)
VALUES
    ('123 Main St', 'Springfield', 'IL', '62704', 'Large Church Gym'),
    ('456 Elm St', 'Shelbyville', 'IN', '46176', 'Small Garage')
    (NULL,NULL, 'IN', '46189', 'Football stadium');
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
-- Insert data into EventContacts table
INSERT INTO EventContacts (Contact_First, Contact_Last, ContactPhone, AddressID)
VALUES
    ('Alice', 'Brown', '5551234', 1),
    ('Bob', 'Davis', '5555678', 2),
    ('Charlie', 'Wilson', '5558765', 1);
-- Insert data into Volunteer table
INSERT INTO Volunteer (First_Name, Last_Name, Email, Phone_Number, HeardAboutID, HoursPerMonth, SewingLevelID, SewingPreferenceID, AddressID)
VALUES
    ('John', 'Smith', 'johnsmith@example.com', '1234567890', 1, 10, 2, 1, 1),
    ('Jane', 'Doe', 'janedoe@example.com', '9876543210', 2, 5, 1, 2, 2),
    ('Mary', 'Johnson', 'mary.johnson@example.com', '9194557630', 3, 15, 3, 3, 2),
    ('James', 'Williams', 'james.williams@example.com', '8013335670', 4, 8, 1, 2, 1);
-- Insert data into Events table
INSERT INTO Events (ConfirmedEventDate, EventAddressID, ContactID, TotalProduced, NumParticipants, SewingPreferenceID, EventStart, EventDuration, JenStory, EventStatusID, EventDetails)
VALUES
    ('2024-12-15', 1, 1, 100, 25, 1, '08:00', '02:00:00', TRUE, 1, 'BYU Campus'),
    ('2024-12-22', 2, 2, 150, 30, 2, '10:00', '03:00:00', FALSE, 2, 'Provo City Mall'),
    ('2024-12-30', 1, 3, 200, 40, 3, '09:00', '04:00:00', TRUE, 3, 'Orem Convention Center');
-- Insert data into Items table
INSERT INTO Items (ItemName)
VALUES
    ('Pockets'),
    ('Collars'),
    ('Envelopes'),
    ('Vests');
-- Insert data into ItemsProduced table
INSERT INTO ItemsProduced (EventID, ItemID, Quantity)
VALUES
    (1, 1, 50),
    (1, 2, 20),
    (2, 3, 100),
    (2, 4, 50),
    (3, 1, 80),
    (3, 2, 40);
-- Insert data into EventDates table
INSERT INTO EventDates (EventID, EventDateType, EventDate)
VALUES
    (1, 'Primary', '2024-12-14'),
    (1, 'Secondary', '2024-12-15'),
    (1, 'Terciary', '2024-12-15'),
    (2, 'Primary', '2024-12-21'),
    (2, 'Secondary', '2024-12-22'),
    (3, 'Primary', '2024-12-29'),
    (3, 'Secondary', '2024-12-30');

-- Insert data into ItemsProduced table
INSERT INTO ItemsProduced (EventID, ItemID, Quantity)
VALUES
  (1, 1, 50),
  (1, 2, 20),
  (2, 3, 100),
  (2, 4, 50),
  (3, 1, 80),
  (3, 2, 40);

-- Insert data into EventContacts table
INSERT INTO EventContacts (Contact_First, Contact_Last, ContactPhone)
VALUES
  ('Alice', 'Brown', '555-1234'),
  ('Bob', 'Davis', '555-5678'),
  ('Charlie', 'Wilson', '555-8765');
