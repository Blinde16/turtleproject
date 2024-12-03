let express = require("express");
let path = require("path");

let app = express();
let security = false;  // This will keep track of the login status
const router = express.Router();
const port = 5000;

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
    res.render("eventManagement")
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
  // Query to fetch "heardAboutOptions" from the "HeardAbout" table
  const heardAboutQuery = knex('HeardAbout').select('Description').distinct();

  // Query to fetch "sewingLevelOptions" from the "SewingLevels" table
  const sewingLevelQuery = knex('SewingLevel').select('Description').distinct();

  // Query to fetch "sewingPreference" from the "SewingPreferences" table
  const sewingPreferenceQuery = knex('SewingPreference').select('Description').distinct();

  // Execute all queries in parallel
  Promise.all([heardAboutQuery, sewingLevelQuery, sewingPreferenceQuery])
    .then(([heardAboutOptions, sewingLevelOptions, sewingPreference]) => {
      // Render the volunteerRequest.ejs template and pass the data
      res.render('volunteerRequest', { 
        heardAboutOptions, 
        sewingLevelOptions, 
        sewingPreference, 
        security 
      });
    })
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    });
});



app.get('/volunteerManagement', (req, res) => {
    res.render("volunteerManagement")
})



app.get('adminLogin', (req,res) => {
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
