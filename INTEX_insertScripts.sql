-- Insert data into Heard_About table
INSERT INTO Heard_About (Description)
VALUES
  ('Social Media'),
  ('Word of Mouth'),
  ('Sponsor'),
  ('Newsletter');

-- Insert data into Sewing_Level table
INSERT INTO Sewing_Level (Description)
VALUES
  ('Beginner'),
  ('Intermediate'),
  ('Advanced');

-- Insert data into Volunteer table
INSERT INTO Volunteer (First_Name, Last_Name, Email, HeardAboutID, SewingLevel, HoursPerMonth)
VALUES
  ('John', 'Doe', 'john.doe@example.com', 1, 2, 10),
  ('Jane', 'Smith', 'jane.smith@example.com', 2, 3, 15),
  ('Mary', 'Johnson', 'mary.johnson@example.com', 3, 1, 5),
  ('James', 'Williams', 'james.williams@example.com', 4, 2, 20);

-- Insert data into EventType table
INSERT INTO EventType (Description)
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

-- Insert data into EventAddress table
INSERT INTO EventAddress (EventStreetAddress, EventCity, EventState, EventZip)
VALUES
  ('123 Main St', 'Springfield', 'IL', '62701'),
  ('456 Oak Ave', 'Decatur', 'IL', '62521'),
  ('789 Pine Rd', 'Champaign', 'IL', '61820');

-- Insert data into Events table
INSERT INTO Events (EventData, EventAddressID, TotalProduced, NumParticipants, EventTypeID, EventStart, EventDuration, JenStory, EventStatusID)
VALUES
  ('2024-12-15', 1, 100, 25, 1, '08:00', '02:00:00', TRUE, 1),
  ('2024-12-22', 2, 150, 30, 2, '10:00', '03:00:00', FALSE, 2),
  ('2024-12-30', 3, 200, 40, 3, '09:00', '04:00:00', TRUE, 3);

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

-- Insert data into EventContacts table
INSERT INTO EventContacts (Contact_First, Contact_Last, ContactPhone)
VALUES
  ('Alice', 'Brown', '555-1234'),
  ('Bob', 'Davis', '555-5678'),
  ('Charlie', 'Wilson', '555-8765');
