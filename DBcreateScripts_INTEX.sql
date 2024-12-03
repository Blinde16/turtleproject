-- Volunteer Table
CREATE TABLE Volunteer (
  VolunteerID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  First_Name VARCHAR(50) NOT NULL,
  Last_Name VARCHAR(50) NOT NULL,
  Email VARCHAR(50) NOT NULL,
  phone_Number VARCHAR(15) NOT NULL,
  HeardAboutID INT,  -- FK for Heard_About table
  SewingLevel INT,   -- FK for Sewing_Level table
  HoursPerMonth INTEGER,
  FOREIGN KEY (HeardAboutID) REFERENCES Heard_About(HeardAboutID),
  FOREIGN KEY (SewingLevel) REFERENCES Sewing_Level(SewingID)
);

-- Heard_About Table, Hi there!
CREATE TABLE Heard_About (
  HeardAboutID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25) NOT NULL
);

-- Sewing_Level Table  
CREATE TABLE Sewing_Level (
  SewingID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25) NOT NULL
);

-- Events Table
CREATE TABLE Events (
  EventID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  EventDate DATE,
  EventAddressID INT,  -- FK for EventAddress table
  TotalProduced INTEGER,
  NumParticipants INTEGER NOT NULL,
  EventTypeID INT,  -- FK for EventType table
  EventStart TIME NOT NULL,
  EventDuration INTERVAL NOT NULL,
  JenStory BOOLEAN NOT NULL,
  EventStatusID INT,  -- FK for EventStatus table
  FOREIGN KEY (EventAddressID) REFERENCES EventAddress(EventAddressID),
  FOREIGN KEY (EventTypeID) REFERENCES EventType(EventTypeID),
  FOREIGN KEY (EventStatusID) REFERENCES EventStatus(EventStatusID)
);

-- EventType Table
CREATE TABLE EventType (
  EventTypeID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25) NOT NULL
);

-- EventStatus Table
CREATE TABLE EventStatus (
  EventStatusID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Description VARCHAR(25) NOT NULL
);

-- EventAddress Table
CREATE TABLE EventAddress (
  EventAddressID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  EventStreetAddress VARCHAR(50),
  EventCity VARCHAR(25) NOT NULL,
  EventState VARCHAR(2) NOT NULL,
  EventZip VARCHAR(15) NOT NULL
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
  ItemName VARCHAR(25) NOT NULL
);

-- EventContacts Table
CREATE TABLE EventContacts (
  ContactID SERIAL PRIMARY KEY,  -- SERIAL for auto-incrementing PK
  Contact_First VARCHAR(50) NOT NULL,
  Contact_Last VARCHAR(50) NOT NULL,
  ContactPhone VARCHAR(15) NOT NULL
);
