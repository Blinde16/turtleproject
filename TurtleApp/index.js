let express = require("express");
let path = require("path");

let app = express();
let security = false;  // This will keep track of the login status

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
    password: "admin",
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



app.get('/eventRequest', (req,res) => {
    res.render("eventRequest")
})

app.get('/volunteerRequest', (req, res) => {
    knex('pokemon')
    .join('poke_type', 'pokemon.poke_type_id', '=', 'poke_type.id')
    .select(
      'pokemon.id',
      'pokemon.description',
      'pokemon.base_total',
      'pokemon.date_created',
      'pokemon.active_poke',
      'pokemon.gender',
      'pokemon.poke_type_id',
      'poke_type.description as poke_type_description'
    ) // returns an array of rows 
    .then(pokemon => {
      // Render the index.ejs template and pass the data
      res.render('index', { pokemon, security });
    })
    // .orderby('name', 'asc') // 'asc' for ascending, 'desc' for descending
    .catch(error => {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
    res.render("volunteerRequest")
})

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
