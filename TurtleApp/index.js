let express = require("express");
let path = require("path");
let app = express();
let security = false;  // This will keep track of the login status
const router = express.Router();
const port = 5500;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database setup with Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "9174",
    database: "turtle",
    port: 5432,
  },
});

// Import helper functions
const { getHeardAboutId, getSewingLevelId, getSewingPreferenceId, insertAddress } = require('./js/helpers');

// Landing Page
app.get("/", (req, res) => {
  // Pass the 'loggedIn' variable to the view
  res.render("index");
});

app.get('/eventManagement', (req,res) => {
    try {
  const events = knex("events")
    .join('eventdates', 'eventdates.eventid', '=', 'events.eventid')
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
    .then(events => {
      // Render the index.ejs template and pass the data
      res.render('eventManagement', {events});
    })
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
})


app.get('/editevent/:eventid', async (req, res) => {
  const { eventid } = req.params;

  try {
    const [events, sewingPreference, eventStatus] = await Promise.all([
      knex('events')
        .where('eventid', eventid)
        .first(), // Fetch only the specific event by ID
      knex('sewingpreference').select('sewingpreferenceid', 'description'),
      knex('eventstatus').select('eventstatusid', 'description')
    ]);

    if (!events) {
      return res.status(404).send('Event not found');
    }

    res.render('editevent', {
      events,
      sewingPreference,
      eventStatus
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/EventRequestForm', async (req, res) => {
    try {
        const sewingPreferences = await knex('sewingpreference').select('sewingpreferenceid', 'description');
        const eventDates = await knex('eventdates').select('eventdateid','eventid', 'eventdatetype', 'eventdate');
        const addresses = await knex('address').select('addressid', 'streetaddress', 'city', 'state', 'zip', 'spacesize');
        const contacts = await knex('eventcontacts').select('contactid', 'contact_first', 'contact_last', 'contactphone', 'addressid');

        res.render('EventRequestForm', {
            sewingPreferences,
            eventDates,
            addresses,
            contacts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;

app.get('/VolunteerForm', async (req, res) => {
  try {
      // Fetch data concurrently using Promise.all
      const [heardAboutOptions, sewingLevelOptions, sewingPreference] = await Promise.all([
          knex('heardabout').select('description'),
          knex('sewinglevel').select('description'),
          knex('sewingpreference').select('description')
      ]);

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

app.get('/thank-you', (req, res) => {
  res.render('thank-you');
});


app.get('/volunteerManagement', (req, res) => {
    try {
    const volunteers = knex("volunteer")
    .join('sewingpreference', 'volunteer.sewingpreferenceid', '=', 'sewingpreference.sewingpreferenceid')
    .join('address', 'volunteer.addressid', '=', 'address.addressid')
    .join('heardabout', 'volunteer.heardaboutid', '=', 'heardabout.heardaboutid')
    .select(
      'volunteer.volunteerid',
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
      'address.city',
      'address.state',
      'address.zip',
    ) // returns an array of rows 
    .then(volunteers => {
      // Render the index.ejs template and pass the data
      res.render('volunteerManagement', {volunteers});
    })
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }

})



app.get('/adminLogin', (req,res) => {
    res.render("adminLogin")
})

app.post('/adminLogin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        // Query the user table to find the record
        const user = knex('user')
            .select('*')
            .where({ username, password }) // Replace with hashed password comparison in production
            .first(); // Returns the first matching record
        if (user) {
            security = true;
        } else {
            security = false;
        }
    } catch (error) {
        res.status(500).send('Database query failed: ' + error.message);
    }
    res.redirect("/")
  });

// Start Server
app.listen(port, () => console.log("Server listening on port", port));
