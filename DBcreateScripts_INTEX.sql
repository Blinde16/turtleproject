-- Volunteer Table
CREATE TABLE Volunteer (
  VolunteerID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  First_Name VARCHAR(50),
  Last_Name VARCHAR(50),
  Email VARCHAR(50),
  HeardAboutID INT,  -- FK for Heard_About table
  SewingLevel INT,   -- FK for Sewing_Level table
  HoursPerMonth INTEGER,
  FOREIGN KEY (HeardAboutID) REFERENCES Heard_About(HeardAboutID),
  FOREIGN KEY (SewingLevel) REFERENCES Sewing_Level(SewingID)
);

-- Heard_About Table
CREATE TABLE Heard_About (
  HeardAboutID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25)
);

-- Sewing_Level Table  
CREATE TABLE Sewing_Level (
  SewingID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25)
);

-- Events Table
CREATE TABLE Events (
  EventID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  EventData DATE,
  EventAddressID INT,  -- FK for EventAddress table
  TotalProduced INTEGER,
  NumParticipants INTEGER,
  EventTypeID INT,  -- FK for EventType table
  EventStart TIME,
  EventDuration INTERVAL,
  JenStory BOOLEAN,
  EventStatusID INT,  -- FK for EventStatus table
  FOREIGN KEY (EventAddressID) REFERENCES EventAddress(EventAddressID),
  FOREIGN KEY (EventTypeID) REFERENCES EventType(EventTypeID),
  FOREIGN KEY (EventStatusID) REFERENCES EventStatus(EventStatusID)
);

-- EventType Table
CREATE TABLE EventType (
  EventTypeID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25)
);

-- EventStatus Table
CREATE TABLE EventStatus (
  EventStatusID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25)
);

-- EventAddress Table
CREATE TABLE EventAddress (
  EventAddressID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  EventStreetAddress VARCHAR(50),
  EventCity VARCHAR(25),
  EventState VARCHAR(2),
  EventZip VARCHAR(15)
);

-- ItemsProduced Table
CREATE TABLE ItemsProduced (
  EventID INT,  -- FK for Events table
  ItemID INT,   -- FK for Items table
  Quantity INTEGER,
  PRIMARY KEY (EventID, ItemID),  -- Composite PK for ItemsProduced table
  FOREIGN KEY (EventID) REFERENCES Events(EventID),
  FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

-- Items Table
CREATE TABLE Items (
  ItemID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  ItemName VARCHAR(25)
);

-- EventContacts Table
CREATE TABLE EventContacts (
  ContactID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Contact_First VARCHAR(50),
  Contact_Last VARCHAR(50),
  ContactPhone VARCHAR(15)
);
