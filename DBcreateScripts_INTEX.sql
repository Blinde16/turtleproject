-- HeardAbout Table
CREATE TABLE HeardAbout (
    HeardAboutID SERIAL PRIMARY KEY,
    Description VARCHAR(25) NOT NULL
);

-- SewingLevel Table
CREATE TABLE SewingLevel (
    SewingLevelID SERIAL PRIMARY KEY,
    Description VARCHAR(25) NOT NULL
);

-- SewingPreference Table
CREATE TABLE SewingPreference (
    SewingPreferenceID SERIAL PRIMARY KEY,
    Description VARCHAR(25) NOT NULL
);

-- Address Table
CREATE TABLE Address (
    AddressID SERIAL PRIMARY KEY,
    StreetAddress VARCHAR(50),
    City VARCHAR(25) NOT NULL,
    State VARCHAR(2) NOT NULL,
    Zip VARCHAR(15) NOT NULL,
    SpaceSize VARCHAR(25)
=======
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
    EventStatusID SERIAL PRIMARY KEY,
    Description VARCHAR(25) NOT NULL
);

-- EventContacts Table
CREATE TABLE EventContacts (
    ContactID SERIAL PRIMARY KEY,
    Contact_First VARCHAR(50) NOT NULL,
    Contact_Last VARCHAR(50) NOT NULL,
    ContactPhone VARCHAR(10) NOT NULL,
    AddressID INT NOT NULL,
    CONSTRAINT fk_eventcontacts_address FOREIGN KEY (AddressID)
        REFERENCES Address(AddressID)
        ON DELETE CASCADE
=======
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

-- Volunteer Table
CREATE TABLE Volunteer (
    VolunteerID SERIAL PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Phone_Number VARCHAR(15),
    HeardAboutID INT,
    HoursPerMonth INTEGER,
    SewingLevelID INT,
    SewingPreferenceID INT,
    AddressID INT,
    CONSTRAINT fk_volunteer_heardabout FOREIGN KEY (HeardAboutID)
        REFERENCES HeardAbout(HeardAboutID),
    CONSTRAINT fk_volunteer_sewinglevel FOREIGN KEY (SewingLevelID)
        REFERENCES SewingLevel(SewingLevelID),
    CONSTRAINT fk_volunteer_sewingpreference FOREIGN KEY (SewingPreferenceID)
        REFERENCES SewingPreference(SewingPreferenceID),
    CONSTRAINT fk_volunteer_address FOREIGN KEY (AddressID)
        REFERENCES Address(AddressID)
        ON DELETE SET NULL
);

-- Events Table
CREATE TABLE Events (
    EventID SERIAL PRIMARY KEY,
    ConfirmedEventDate DATE,
    EventAddressID INT,
    ContactID INT,
    TotalProduced INTEGER,
    NumParticipants INTEGER,
    SewingPreferenceID INT,
    EventStart TIME,
    EventDuration INTERVAL,
    JenStory BOOLEAN,
    EventStatusID INT,
    EventDetails VARCHAR(255),
    CONSTRAINT fk_events_address FOREIGN KEY (EventAddressID)
        REFERENCES Address(AddressID),
    CONSTRAINT fk_events_contact FOREIGN KEY (ContactID)
        REFERENCES EventContacts(ContactID),
    CONSTRAINT fk_events_sewingpreference FOREIGN KEY (SewingPreferenceID)
        REFERENCES SewingPreference(SewingPreferenceID),
    CONSTRAINT fk_events_eventstatus FOREIGN KEY (EventStatusID)
        REFERENCES EventStatus(EventStatusID)
);

-- EventDates Table
CREATE TABLE EventDates (
    EventDateID SERIAL PRIMARY KEY,
    EventID INT NOT NULL,
    EventDateType VARCHAR(25),
    EventDate DATE NOT NULL,
    CONSTRAINT fk_eventdates_events FOREIGN KEY (EventID)
        REFERENCES Events(EventID)
        ON DELETE CASCADE
);

-- Items Table
CREATE TABLE Items (
    ItemID SERIAL PRIMARY KEY,
    ItemName VARCHAR(25) NOT NULL
);

-- ItemsProduced Table
CREATE TABLE ItemsProduced (
    EventID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (EventID, ItemID),
    CONSTRAINT fk_itemsproduced_events FOREIGN KEY (EventID)
        REFERENCES Events(EventID)
        ON DELETE CASCADE,
    CONSTRAINT fk_itemsproduced_items FOREIGN KEY (ItemID)
        REFERENCES Items(ItemID)
        ON DELETE CASCADE
);

-- Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(25) NOT NULL,
    Password VARCHAR(25) NOT NULL,
    Email VARCHAR(25) NOT NULL
=======
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
