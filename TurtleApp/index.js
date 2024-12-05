let express = require("express");
let path = require("path");
let app = express();
let security = false;  // This will keep track of the login status
const router = express.Router();
const port = process.env.PORT || 5500;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'views/Images' directory
app.use('/images', express.static(path.join(__dirname, 'views', 'Images')));


// Database setup with Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.RDS_HOSTNAME || "localhost",
    user: process.env.RDS_USERNAME || "postgres",
    password: process.env.RDS_PASSWORD || "9174",
    database: process.env.RDS_DB_NAME || "turtle",
    port: process.env.RDS_PORT || 5432,
    ssl: process.env.DB_SLL ? {rejectUnauthorized: false}: false
  }
});

// Landing Page
app.get("/", (req, res) => {
  // Pass the 'loggedIn' variable to the view
  res.render("index", {security});
});

// Event management get route
app.get('/eventManagement', (req,res) => {
    try {
  const events = knex("events")
    .join('eventcontacts', 'events.contactid', '=', 'eventcontacts.contactid')
    .join('sewingpreference', 'events.sewingpreferenceid', '=', 'sewingpreference.sewingpreferenceid')
    .join('address', 'events.eventaddressid', '=', 'address.addressid')
    .join('eventstatus', 'events.eventstatusid', '=', 'eventstatus.eventstatusid')
    .select(
      'events.eventid',
      'events.confirmedeventdate',
      'address.streetaddress',
      'address.city',
      'address.state',
      'address.zip',
      'eventcontacts.contactid',
      'eventcontacts.contact_first',
      'eventcontacts.contact_last',
      'eventcontacts.contactphone',
      'events.numparticipants',
      'sewingpreference.sewingpreferenceid',
      'sewingpreference.description as sewing_description',
      'events.eventstart',
      'events.eventduration',
      'events.jenstory',
      'eventstatus.eventstatusid',
      'eventstatus.description as status_description',
      'events.eventdetails'  
    ) // returns an array of rows 
    .orderBy('events.confirmedeventdate', 'desc')
    .orderBy('events.eventstart', 'asc')
    .then(events => {
      // Render the index.ejs template and pass the data
      res.render('eventManagement', {events});
    })
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
})

// Edit event get route
app.get('/editevent/:eventid', (req, res) => {
  try {
    const eventid = req.params.eventid;
    knex('events')
      .join('eventcontacts', 'events.contactid', '=', 'eventcontacts.contactid')
      .join('sewingpreference', 'events.sewingpreferenceid', '=', 'sewingpreference.sewingpreferenceid')
      .join('eventstatus', 'events.eventstatusid', '=', 'eventstatus.eventstatusid')
      .join('address', 'events.eventaddressid', '=', 'address.addressid')
      .select(
        'events.eventid',
        'events.confirmedeventdate',
        'events.numparticipants',
        'address.streetaddress',
        'address.city',
        'address.state',
        'address.zip',
        'address.spacesize',
        'events.eventstart',
        'events.eventduration',
        'events.jenstory',
        'events.eventdetails',
        'eventcontacts.contact_first',
        'eventcontacts.contact_last',
        'eventcontacts.contactphone',
        'sewingpreference.sewingpreferenceid',
        'sewingpreference.description as sewing_description',
        'eventstatus.eventstatusid',
        'eventstatus.description as status_description',
        'eventcontacts.contactid', // Add contactid
        'address.addressid' // Add addressid
      )
      .where('eventid', eventid)
      .first()
      .then(events => {
        knex('sewingpreference').select('sewingpreferenceid', 'description').distinct().then(sewingPreferenceoptions => {
          knex('eventstatus').select('eventstatusid', 'description').then(eventstatusoptions => {
            knex('itemsproduced')
              .join('items', 'itemsproduced.itemid', '=', 'items.itemid')
              .select('items.itemname', 'itemsproduced.itemid', 'itemsproduced.quantity')
              .where('itemsproduced.eventid', eventid)
              .then(iteminfo => {
                res.render('editevent', { events, sewingPreferenceoptions, eventstatusoptions, iteminfo });
              });
          });
        });
      });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit event post route
app.post('/editevent/:eventid/:addressid/:contactid', async (req, res) => {
  try {
    const {
      confirmedeventdate,
      firstname,
      lastname,
      phone,
      numParticipants,
      sewingPreferenceid,
      totalproduced,
      streetaddress,
      city,
      state,
      zip,
      eventStart,
      eventDuration,
      jenStory,
      eventstatus,
      eventdetails
    } = req.body;
    console.log(confirmedeventdate,
      firstname,
      lastname,
      phone,
      numParticipants,
      sewingPreferenceid,
      totalproduced,
      streetaddress,
      city,
      state,
      zip,
      eventStart,
      eventDuration,
      jenStory,
      eventstatus,
      eventdetails)

    const parsedPhone = phone.replace(/\D/g, ''); // Remove non-numeric characters
    const eventid = parseInt(req.params.eventid, 10);  // Ensure eventid is a number
    const addressid = req.params.addressid;
    const contactid = req.params.contactid;

    // TEST: Log eventid to ensure it's correct
    console.log('eventid:', eventid);

    // Step 1: Check if the event exists
    const event = await knex('events').where('eventid', eventid).first();
    if (!event) {
      console.log(`Event with id ${eventid} not found.`);
      return res.status(404).send('Event not found');
    }

    // Step 2: Update the events table
    const result = await knex('events')
      .where('eventid', eventid)
      .update({
        confirmedeventdate: confirmedeventdate,
        eventaddressid: addressid, // Use eventaddressid directly instead of addressid
        totalproduced: parseInt(totalproduced, 10) || 0,
        numparticipants: parseInt(numParticipants, 10) || 0,
        sewingpreferenceid: parseInt(sewingPreferenceid, 10) || null,
        eventstart: eventStart,
        eventduration: eventDuration, // Store as a string representing the interval
        jenstory: jenStory === 'true',
        eventstatusid: parseInt(eventstatus, 10) || null,
        eventdetails: eventdetails
      });

    console.log(`${result} rows updated`);  // Log how many rows were affected

    // Step 3: Update the contact table
    await knex('eventcontacts')
      .where('contactid', contactid)
      .update({
        contact_first: firstname,
        contact_last: lastname,
        contactphone: parsedPhone
      });

    // Redirect or respond with success
    res.redirect('/eventManagement');
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle viewing event details
app.get('/eventdetails/:eventid', async (req, res) => {
  const eventId = req.params.eventid;

  try {
      // Query the database using Knex with joins
      const event = await knex('events')
          .join('eventcontacts', 'events.contactid', 'eventcontacts.contactid')
          .select(
              'events.confirmedeventdate',
              'eventcontacts.contact_first',
              'eventcontacts.contact_last'
          )
          .where('events.eventid', eventId)
          .first(); // Fetch the first (and only) result for the event details

      if (!event) {
          return res.status(404).send('Event not found');
      }

      // Query to get items produced and their quantities
      const itemsProduced = await knex('itemsproduced')
          .join('items', 'itemsproduced.itemid', 'items.itemid')
          .select('items.itemname', 'itemsproduced.quantity')
          .where('itemsproduced.eventid', eventId);

      // Render the view and pass both the event details and items produced
      res.render('eventdetails', {
          event: {
              eventdata: event.confirmedeventdate,
              contact_first: event.contact_first,
              contact_last: event.contact_last
          },
          itemsProduced
      });
  } catch (error) {
      console.error('Error fetching event details:', error);
      res.status(500).send('Server error');
  }
});

// Delete route with success confirmation
app.post('/deleteevent/:eventid', async (req, res) => {
  const eventId = req.params.eventid;

  try {
      // Delete from related tables first (if needed)
      await knex('itemsproduced').where('eventid', eventId).del();

      // Delete from the main events table
      await knex('events').where('eventid', eventId).del();

      console.log(`Event with ID ${eventId} deleted successfully.`);
      res.redirect('/eventmanagement?deletesuccess=true'); // Redirect with query parameter
  } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).send('An error occurred while deleting the event.');
  }
});

// Delete volunteer route
app.post("/deletevolunteer/:id", (req,res) => {
  let id = req.params.id;
  knex("volunteer")
  .where("volunteerid", id)
  .del()
  .then(() => {
    res.redirect('/volunteerManagement')
  })
  .catch(error => {
    console.error('Error deleting volunteer:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Event request get route
app.get('/EventRequestForm', async (req, res) => {
    try {
        const sewingPreferences = await knex('sewingpreference').select('sewingpreferenceid', 'description');
        const eventDates = await knex('eventdates').select('eventdateid','eventid', 'eventdatetype', 'eventdate');
        const addresses = await knex('address').select('addressid', 'streetaddress', 'city', 'state', 'zip', 'spacesize');
        const contacts = await knex('eventcontacts').select('contactid', 'contact_first', 'contact_last', 'contactphone', 'addressid');
        const eventStart = await knex('events').select('eventstart', 'eventduration', 'jenstory');
        console.log(eventStart);  // Log the data being passed to the template


        res.render('EventRequestForm', {
            sewingPreferences,
            eventDates,
            addresses,
            contacts,
            eventStart
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Event request form route
app.post('/EventRequestForm', async (req, res) => {
  try {
    // Extract data from the form submission
    const {
      numParticipants,
      sewingPreference,
      primaryDate,
      streetAddress,
      city,
      state,
      zip,
      SpaceSize,
      contact_first,
      contact_last,
      contactphone,
      eventstart,
      eventduration,
      jenstory,
    } = req.body;
    // Log the extracted form data to check their values
    console.log('Form Data:', {
      numParticipants,
      sewingPreference,
      primaryDate,
      streetAddress,
      city,
      state,
      zip,
      SpaceSize,
      contact_first,
      contact_last,
      contactphone,
      eventstart,
      eventduration,
      jenstory,
    });

    // Insert the address into the address table and retrieve the addressid
    const [addressResult] = await knex('address')
      .insert({
        streetaddress: streetAddress,
        city: city,
        state: state,
        zip: zip,
        spacesize: SpaceSize,
      })
      .returning('addressid'); // Get the autogenerated addressid
    const addressID = addressResult.addressid; // Get the autogenerated addressid

    // Insert the contact into the eventcontacts table and let PostgreSQL generate the contactid
    const [contactResult] = await knex('eventcontacts')
      .insert({
        contact_first: contact_first,
        contact_last: contact_last,
        contactphone: contactphone,
        addressid: addressID,  // Use the addressID we got above
      })
      .returning('contactid'); // Let the database handle the contactid auto-generation
    const contactID = contactResult.contactid; // Get the autogenerated contactid

    // Insert the event into the events table
    await knex('events').insert({
      confirmedeventdate: primaryDate,
      eventaddressid: addressID,
      contactid: contactID,
      numparticipants: numParticipants,
      sewingpreferenceid: sewingPreference,
      eventstart: eventstart,
      eventduration: eventduration,
      jenstory: jenstory,
      eventstatusid: 1,
    });

    // Redirect to a confirmation page or render a success message
    res.render('thank-you');
  } catch (err) {
    console.error("Error inserting form data:", err);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Add event form for Jen
app.get('/addevent', async (req, res) => {
  try {
      // Fetch the necessary data for the form
      const sewingPreferences = await knex('sewingpreference').select('sewingpreferenceid', 'description');
      const eventDates = await knex('eventdates').select('eventdateid','eventid', 'eventdatetype', 'eventdate');
      const addresses = await knex('address').select('addressid', 'streetaddress', 'city', 'state', 'zip', 'spacesize');
      const contacts = await knex('eventcontacts').select('contactid', 'contact_first', 'contact_last', 'contactphone', 'addressid');
      
      // Render the Add Event page
      res.render('AddEvent', {
          sewingPreferences,
          eventDates,
          addresses,
          contacts
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
  }
});

// Add event post route for Jen
app.post('/addevent', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      numParticipants,
      sewingPreference,
      eventDate,
      streetAddress,
      city,
      state,
      zip,
      spaceSize,
      contactphone,
      eventStart,
      eventDuration,
      jenStory
    } = req.body;

    console.log('Form Data:', req.body);

    // Insert into the address table
    const [addressResult] = await knex('address')
      .insert({
        streetaddress: streetAddress,
        city: city,
        state: state,
        zip: zip,
        spacesize: spaceSize
      })
      .returning('addressid');
    const addressID = addressResult.addressid;

    // Insert into the eventcontacts table
    const [contactResult] = await knex('eventcontacts')
      .insert({
        contact_first: firstName,
        contact_last: lastName,
        contactphone: contactphone,
        addressid: addressID
      })
      .returning('contactid');
    const contactID = contactResult.contactid;

    // Insert into the events table
    await knex('events').insert({
      confirmedeventdate: eventDate,
      eventaddressid: addressID,
      contactid: contactID,
      numparticipants: numParticipants,
      sewingpreferenceid: sewingPreference,
      eventstart: eventStart,
      eventduration: eventDuration,
      jenstory: jenStory,
      eventstatusid: 1
    });

    // Fetch events data for eventManagement page
    const events = await knex('events')
      .join('eventcontacts', 'events.contactid', '=', 'eventcontacts.contactid')
      .join('address', 'events.eventaddressid', '=', 'address.addressid')
      .select(
        'events.eventid',
        'events.confirmedeventdate',
        'events.numparticipants',
        'eventcontacts.contact_first',
        'eventcontacts.contact_last',
        'eventcontacts.contactphone',
        'address.streetaddress',
        'address.city',
        'address.state',
        'address.zip'
      );

    // Render eventManagement.ejs with events data
    res.redirect('/admin-thank-you');
  } catch (err) {
    console.error("Error inserting event data:", err);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Admin thank you route
app.get('/admin-thank-you', (req, res) => {
  res.render('adminThankYou');
});

// Volunteer form route
app.get('/VolunteerForm', async (req, res) => {
  try {
      // Fetch data concurrently using Promise.all
      const [heardAboutOptions, sewingLevelOptions, sewingPreference] = await Promise.all([
          knex('heardabout').select('description'),
          knex('sewinglevel').select('description'),
          knex('sewingpreference').select('description')
      ]);
      
      // Log results for debugging
      console.log('Heard About Options:', heardAboutOptions);
      console.log('Sewing Level Options:', sewingLevelOptions);
      console.log('Sewing Preferences:', sewingPreference);

      // Render the VolunteerForm view with the fetched data
      res.render('VolunteerForm', { 
          heardAboutOptions, 
          sewingLevelOptions, 
          sewingPreference
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Volunteer management get route
app.get('/volunteerManagement', (req, res) => {
    try {
    const volunteers = knex("volunteer")
    .join('sewingpreference', 'volunteer.sewingpreferenceid', '=', 'sewingpreference.sewingpreferenceid')
    .join('sewinglevel', 'volunteer.sewinglevelid', '=', 'sewinglevel.sewinglevelid')
    .join('address', 'volunteer.addressid', '=', 'address.addressid')
    .join('heardabout', 'volunteer.heardaboutid', '=', 'heardabout.heardaboutid')
    .select(
      'volunteer.volunteerid',
      'sewinglevel.description as sewingleveldescription',
      'volunteer.first_name',
      'volunteer.last_name',
      'volunteer.phone_number',
      'volunteer.email',
      'heardabout.heardaboutid',
      'heardabout.description as heardaboutDescription',
      'volunteer.hourspermonth',
      'volunteer.sewinglevelid',
      'sewingpreference.sewingpreferenceid',
      'sewingpreference.description as sewing_description',
      'address.addressid',
      'address.streetaddress',
      'address.city as city',
      'address.state as state',
      'address.zip',
    ) // returns an array of rows 
    .then(volunteers => {
      res.render('volunteerManagement', {volunteers})
    });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }

});

const { getHeardAboutId, getSewingLevelId, getSewingPreferenceId, insertAddress } = require('./js/helpers');

// Volunteer form post route
app.post('/VolunteerFormSubmit', async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    hoursPerMonth, 
    heardAbout, 
    sewingLevel, 
    sewingPreference, 
    streetAddress, 
    city, 
    state, 
    zip 
  } = req.body;
  console.log('Form submitted');
  
  try {
    // Fetch the IDs for 'heardAbout', 'sewingLevel', and 'sewingPreference'
    const heardAboutId = await getHeardAboutId(knex, heardAbout);
    const sewingLevelId = await getSewingLevelId(knex, sewingLevel);
    const sewingPreferenceId = await getSewingPreferenceId(knex, sewingPreference);

    // Insert address and retrieve address ID
    const addressId = await insertAddress(knex, streetAddress, city, state, zip);

    // Check if all values are properly set
    console.log('Heard About ID:', heardAboutId);
    console.log('Sewing Level ID:', sewingLevelId);
    console.log('Sewing Preference ID:', sewingPreferenceId);
    console.log('Address ID:', addressId);
    
    // Prepare data for insertion into the volunteer table, without volunteerid
    const volunteerData = {
      first_name: firstName, 
      last_name: lastName, 
      email: email, 
      phone_number: phone, 
      heardaboutid: heardAboutId, 
      hourspermonth: hoursPerMonth, 
      sewinglevelid: sewingLevelId, 
      sewingpreferenceid: sewingPreferenceId, 
      addressid: addressId
    };
    
    // Log the data to check
    console.log('Data to insert:', volunteerData);

    // Insert the data without specifying volunteerid (let it auto-increment)
    const result = await knex('volunteer')
      .insert(volunteerData)
      .returning('volunteerid');  // You can return the volunteerid if needed

    // Log the inserted volunteer ID if needed
    console.log('Inserted volunteer ID:', result[0].volunteerid);

    res.redirect('/thank-you'); // Redirect to a confirmation page
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error processing your request.');
  }
});
 
// User thank you route
app.get('/thank-you', (req, res) => {
  res.render('thank-you');
});

// Edit volunteer get route
app.get('/editvolunteer/:id', (req,res) => {
  let id = req.params.id
  knex("volunteer").join("heardabout", "heardabout.heardaboutid", "=", "volunteer.heardaboutid")
  .join("sewinglevel", "sewinglevel.sewinglevelid", '=', 'volunteer.sewinglevelid')
  .join("sewingpreference", "sewingpreference.sewingpreferenceid", "=", "volunteer.sewingpreferenceid")
  .join("address", "address.addressid", "=", "volunteer.addressid")
  .select('volunteerid', 
    'volunteer.heardaboutid', 
    'address.city as volunteercity',
    'address.state as volunteerstate',
    'sewingpreference.description as sewingpreferencedescription',
    'sewinglevel.description as sewingleveldescription',
    'heardabout.description as heardaboutdescription', 
    'volunteer.first_name', 
    'volunteer.last_name', 
    'volunteer.email',
    'volunteer.phone_number',
    'volunteer.hourspermonth',
    'volunteer.sewinglevelid',
    'volunteer.sewingpreferenceid',
    'volunteer.addressid'
  )
  .where("volunteerid", id).first().then(volunteer => {
    knex("heardabout").select("heardaboutid", "description").then(heardAboutOptions => {
    knex("sewinglevel").select("sewinglevelid", "description").then(sewingLevelOptions => {
      knex("sewingpreference").select("sewingpreferenceid", "description").then(sewingPreferenceOptions => {
        res.render('editVolunteer', {volunteer, heardAboutOptions, sewingLevelOptions, sewingPreferenceOptions})
      })
    })
    })
  })
  .catch(error => {
    console.error('Error fetching Data:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Edit volunteer post route
app.post('/editvolunteer/:volunteerid/:addressid', (req, res) => {
  const volunteerid = req.params.volunteerid;
  const addressid = req.params.addressid;
  // Access each value directly from req.body
  const first_name = req.body.first_name;
  const last_name = req.body.last_name; // Convert to integer
  const email = req.body.email;
  const phone_number = parseInt(req.body.phone_number);
  const heardaboutid = parseInt(req.body.heard_about_id);
  const hours_per_month = parseInt(req.body.hours_per_month);
  const sewinglevelid = parseInt(req.body.sewing_level);
  const sewingpreferenceid = parseInt(req.body.sewing_preference);
  const city = req.body.city;
  const state = req.body.state;
  
  // Update the Volunteer in the database
  knex('volunteer')
    .where('volunteerid', volunteerid)
    .update({
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      heardaboutid: heardaboutid,
      hourspermonth: hours_per_month,
      sewinglevelid: sewinglevelid,
      sewingpreferenceid: sewingpreferenceid
    })
  .then(() => {
    // After updating the volunteer, update the address table
    return knex('address')
      .where('addressid', addressid) // Use the correct addressid
      .update({
        city: city,
        state: state
      });
  })
  .then(() => {
    // Redirect after both updates succeed
    res.redirect("/volunteerManagement");
  })
  .catch(error => {
    console.error('Error updating volunteer or address:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Add volunteer get route
app.get("/addVolunteer", (req,res) => {
  knex("volunteer").join("heardabout", "heardabout.heardaboutid", "=", "volunteer.heardaboutid")
  .join("sewinglevel", "sewinglevel.sewinglevelid", '=', 'volunteer.sewinglevelid')
  .join("sewingpreference", "sewingpreference.sewingpreferenceid", "=", "volunteer.sewingpreferenceid")
  .join("address", "address.addressid", "=", "volunteer.addressid")
  .select('volunteerid', 
    'volunteer.heardaboutid', 
    'address.city as volunteercity',
    'address.state as volunteerstate',
    'sewingpreference.description as sewingpreferencedescription',
    'sewinglevel.description as sewingleveldescription',
    'heardabout.description as heardaboutdescription', 
    'volunteer.first_name', 
    'volunteer.last_name', 
    'volunteer.email',
    'volunteer.phone_number',
    'volunteer.hourspermonth',
    'volunteer.sewinglevelid',
    'volunteer.sewingpreferenceid',
    'volunteer.addressid'
  )
  .then(volunteer => {
    knex("heardabout").select("heardaboutid", "description").then(heardAboutOptions => {
    knex("sewinglevel").select("sewinglevelid", "description").then(sewingLevelOptions => {
      knex("sewingpreference").select("sewingpreferenceid", "description").then(sewingPreferenceOptions => {
        res.render('addVolunteer', {volunteer, heardAboutOptions, sewingLevelOptions, sewingPreferenceOptions})
      })
    })
    })
  })
  .catch(error => {
    console.error('Error fetching Data:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Add volunteer post route
app.post("/addVolunteer", (req,res) => {
  // Extract form values from req.body
  const first_name = req.body.first_name || ''; // Default to empty string if not provided
  const last_name = req.body.last_name || ''; // Default to empty string if not provided
  const email = req.body.email;
  const phone_number = parseInt(req.body.phone_number);
  const heardaboutid = parseInt(req.body.heard_about_id);
  const hours_per_month = parseInt(req.body.hours_per_month);
  const sewinglevelid = parseInt(req.body.sewing_level);
  const sewingpreferenceid = parseInt(req.body.sewing_preference);
  const city = req.body.city;
  const state = req.body.state;
  const zip = parseInt(req.body.zip);
  // Insert the new Character into the database
  knex("address")
    .insert({
      city: city,
      state: state,
      zip: zip
    })
    .returning('addressid') // Replace 'id' with the actual name of your address table's ID column
    .then(([returningData]) => {
      console.log("Address Insert Result:", returningData); // Debug log
      if (!returningData || returningData.length === 0) {
        throw new Error("Failed to retrieve address ID from database.");
      }
      const newAddressId = returningData.addressid || returningData;
        console.log("New Address ID:", newAddressId); // Debug log
      // newAddressId contains the ID of the newly inserted address
      return knex('volunteer').insert({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        heardaboutid: heardaboutid,
        hourspermonth: hours_per_month,
        sewinglevelid: sewinglevelid,
        sewingpreferenceid: sewingpreferenceid,
        addressid: newAddressId // Use the correct variable here
      });
    })
    .then(() => {
      res.redirect('/volunteerManagement'); // Redirect to the volunteer list page after adding
    })
    .catch(error => {
      console.error('Error adding Character:', error);
      res.status(500).send('Internal Server Error');
    })
});

// Tableau dashboard get route
app.get('/datadashboard', (req,res) => {
  res.render("datadashboard")
})

// Admin login get route
app.get('/adminLogin', (req,res) => {
    res.render("adminLogin")
})

// Admin login post route
app.post('/adminLogin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
    // Query the user table to find the record
    const user = knex('users')
      .select('*')
      .where({ username:username, password:password }) // Replace with hashed password comparison in production
      .first() // Returns the first matching record
      .then(user => {
        if (user) {
          security = true;
      } else {
          security = false;
      }
      res.render('index', {security})
      })
      .catch(error => {
        console.error('Error adding Character:', error);
        res.status(500).send('Internal Server Error');
      })
});

// User management get route  
app.get("/userManagement", (req,res) => {
  knex('users')
  .select(
    'userid',
    'username',
    'password',
    'email'
  )
  .then(userinfo => {
    res.render('userManagement', {userinfo})
  })
})

// Edit user get route
app.get("/editUser/:id", (req,res) => {
  const id = req.params.id;
  knex('users')
  .select(
    "userid",
    "username",
    "password",
    "email"
  )
  .where('userid',id)
  .first()
  .then(user => {
    res.render("editUser", {user})
  })
})

// Edit user post route
app.post("/editUser/:id", (req,res) => {
  const id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  knex('users')
  .where('userid', id)
  .update({
    username: username,
    password: password,
    email:email
})
.then(() => {
  res.redirect('/userManagement')
})
.catch(error => {
  console.error('Error updating user', error);
  res.status(500).send('Internal Server Error');
})
});

// Add user get route
app.get("/addUser", (req,res) => {
knex('users')
.select(
  'userid',
  'username',
  'password',
  'email'
)
.then(userinfo => {
  res.render('addUser', {userinfo})
})
});
// Add user post route
app.post("/addUser", (req,res) => {
const username = req.body.username;
const password = req.body.password;
const email = req.body.email
knex('users')
.insert({
  username: username,
  password: password,
  email:email
})
.then(() => {
  res.redirect('/userManagement')
})
.catch(error => {
  console.error('Error updating user', error);
  res.status(500).send('Internal Server Error');
})
});
 
// Delete user post route
app.post("/deleteUser/:id", (req,res) => {
  let id = req.params.id;
  knex('users')
  .where('userid', id)
  .del()
  .then(() => {
    res.redirect('/userManagement')
  })
  .catch(error => {
    console.error('Error deleting volunteer:', error);
    res.status(500).send('Internal Server Error');
  });
});
 
// Start Server
app.listen(port, () => console.log("Server listening on port", port));
