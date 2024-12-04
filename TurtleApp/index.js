let express = require("express");
let path = require("path");
let app = express();
let security = false;  // This will keep track of the login status
const router = express.Router();
const port = 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

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
      'events.eventdate',
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


app.get('/volunteerRequest', (req, res) => {
    try {
  // Query to fetch "heardAboutOptions" from the "HeardAbout" table
  const heardAboutQuery = knex('heardabout').select('description');

  // Query to fetch "sewingLevelOptions" from the "SewingLevels" table
  const sewingLevelQuery = knex('sewinglevel').select('description');

  // Query to fetch "sewingPreference" from the "SewingPreferences" table
  const sewingPreferenceQuery = knex('sewingpreference').select('description');

      res.render('volunteerRequest', { 
        heardAboutOptions, 
        sewingLevelOptions, 
        sewingPreference, 
        security 
      });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/volunteerManagement', (req, res) => {
    try {
    const volunteers = knex("volunteer")
    .join('sewingpreference', 'volunteer.sewingpreferenceid', '=', 'sewingpreference.sewingpreferenceid')
    .join('address', 'volunteer.addressid', '=', 'address.addressid')
    .join('heard_about', 'volunteer.heardaboutid', '=', 'heard_about.heardaboutid')
    .select(
      'volunteer.volunteerid',
      'volunteer.first_name',
      'volunteer.last_name',
      'volunteer.phone_number',
      'volunteer.email',
      'heard_about.heardaboutid',
      'heard_about.description as heardaboutDescription',
      'volunteer.hourspermonth',
      'volunteer.sewinglevel',
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
