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
    AddressID INT REFERENCES Address(AddressID)
);
-- Volunteer Table
CREATE TABLE Volunteer (
    VolunteerID SERIAL PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Phone_Number VARCHAR(15),
    HeardAboutID INT REFERENCES HeardAbout(HeardAboutID),
    HoursPerMonth INTEGER,
    SewingLevelID INT REFERENCES SewingLevel(SewingLevelID),
    SewingPreferenceID INT REFERENCES SewingPreference(SewingPreferenceID),
    AddressID INT REFERENCES Address(AddressID)
);
-- Events Table
CREATE TABLE Events (
    EventID SERIAL PRIMARY KEY,
    ConfirmedEventDate DATE,
    EventAddressID INT REFERENCES Address(AddressID),
    ContactID INT REFERENCES EventContacts(ContactID),
    TotalProduced INTEGER,
    NumParticipants INTEGER,
    SewingPreferenceID INT REFERENCES SewingPreference(SewingPreferenceID),
    EventStart TIME,
    EventDuration INTERVAL,
    JenStory BOOLEAN,
    EventStatusID INT REFERENCES EventStatus(EventStatusID),
    EventDetails VARCHAR(255)
);
-- EventDates Table
CREATE TABLE EventDates (
    EventDateID SERIAL PRIMARY KEY,
    EventID INT REFERENCES Events(EventID),
    EventDateType VARCHAR(25),
    EventDate DATE NOT NULL
);
-- Items Table
CREATE TABLE Items (
    ItemID SERIAL PRIMARY KEY,
    ItemName VARCHAR(25) NOT NULL
);
-- ItemsProduced Table
CREATE TABLE ItemsProduced (
    EventID INT REFERENCES Events(EventID),
    ItemID INT REFERENCES Items(ItemID),
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (EventID, ItemID)
);
-- Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(25) NOT NULL,
    Password VARCHAR(25) NOT NULL,
    Email VARCHAR(25) NOT NULL
);