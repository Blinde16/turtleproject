-- Insert data into Users table
INSERT INTO Users (UserID, UserName, Password, Email)
VALUES
    (1, 'johndoe', 'password123', 'johndoe@example.com'),
    (2, 'janedoe', 'password456', 'janedoe@example.com');
	
-- Insert data into Address table
INSERT INTO Address (AddressID, StreetAddress, City, State, Zip, SpaceSize)
VALUES
    (1, '123 Main St', 'Springfield', 'IL', '62704', 'Large Church Gym'),
    (2, '456 Elm St', 'Shelbyville', 'IN', '46176', 'Small Garage'),
    (3, NULL,'Louisville', 'IN', '46189', 'Football stadium');
	
-- Insert data into HeardAbout table
INSERT INTO HeardAbout (HeardAboutID, Description)
VALUES
    (1, 'Social Media'),
    (2, 'Word of Mouth'),
    (3, 'Sponsor'),
    (4, 'Newsletter');

-- Insert data into SewingLevel table
INSERT INTO SewingLevel (SewingLevelID, Description)
VALUES
    (1, 'Beginner'),
    (2, 'Intermediate'),
    (3, 'Advanced');

-- Insert data into SewingPreference table
INSERT INTO SewingPreference (SewingPreferenceID, Description)
VALUES
    (1, 'Sewing'),
    (2, 'Non-Sewing'),
    (3, 'Both');

-- Insert data into EventStatus table
INSERT INTO EventStatus (EventStatusID, Description)
VALUES
    (1, 'Scheduled'),
    (2, 'Completed'),
    (3, 'Cancelled');

-- Insert data into EventContacts table
INSERT INTO EventContacts (ContactID, Contact_First, Contact_Last, ContactPhone, AddressID)
VALUES
    (1, 'Alice', 'Brown', '5551234', 1),
    (2, 'Bob', 'Davis', '5555678', 2),
    (3, 'Charlie', 'Wilson', '5558765', 1);
	
-- Insert data into Volunteer table
INSERT INTO Volunteer (VolunteerID, First_Name, Last_Name, Email, Phone_Number, HeardAboutID, HoursPerMonth, SewingLevelID, SewingPreferenceID, AddressID)
VALUES
    (1, 'John', 'Smith', 'johnsmith@example.com', '1234567890', 1, 10, 2, 1, 1),
    (2, 'Jane', 'Doe', 'janedoe@example.com', '9876543210', 2, 5, 1, 2, 2),
    (3, 'Mary', 'Johnson', 'mary.johnson@example.com', '9194557630', 3, 15, 3, 3, 2),
    (4, 'James', 'Williams', 'james.williams@example.com', '8013335670', 4, 8, 1, 2, 1);

-- Insert data into Events table
INSERT INTO Events (EventID, ConfirmedEventDate, EventAddressID, ContactID, TotalProduced, NumParticipants, SewingPreferenceID, EventStart, EventDuration, JenStory, EventStatusID, EventDetails)
VALUES
    (1, '2024-12-15', 1, 1, 100, 25, 1, '08:00', '02:00:00', TRUE, 1, 'BYU Campus'),
    (2, '2024-12-22', 2, 2, 150, 30, 2, '10:00', '03:00:00', FALSE, 2, 'Provo City Mall'),
    (3, '2024-12-30', 1, 3, 200, 40, 3, '09:00', '04:00:00', TRUE, 3, 'Orem Convention Center');

-- Insert data into Items table
INSERT INTO Items (ItemID, ItemName)
VALUES
    (1, 'Pockets'),
    (2, 'Collars'),
    (3, 'Envelopes'),
    (4, 'Vests');

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
INSERT INTO EventDates (EventDateID, EventID, EventDateType, EventDate)
VALUES
    (1, 1, 'Primary', '2024-12-14'),
    (2, 1, 'Secondary', '2024-12-15'),
    (3, 1, 'Tertiary', '2024-12-15'),
    (4, 2, 'Primary', '2024-12-21'),
    (5, 2, 'Secondary', '2024-12-22'),
    (6, 3, 'Primary', '2024-12-29'),
    (7, 3, 'Secondary', '2024-12-30');
