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
  res.render("index", {security});
});

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
          'eventstatus.description as status_description'
        )
        .where('eventid', eventid)
        .first()
      .then(events => {
        console.log(events)
        knex('sewingpreference').select('sewingpreferenceid', 'description').then(sewingPreferenceoptions => {
          console.log(sewingPreferenceoptions)
          knex('eventstatus').select('eventstatusid', 'description').then(eventstatusoptions => {
            console.log(eventstatusoptions)
            res.render('editevent', {events,sewingPreferenceoptions, eventstatusoptions})
          })
        })
      }) // Fetch only the specific event by ID
  }
    catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/editevent/:eventid/:addressid/:contactid', (req, res) => {
  const eventid = req.params.eventid;
  const addressid = req.params.eventid;
  const contactid = req.params.contactid;
  // Access each value directly from req.body
  const confirmedeventdate = req.body.confirmedeventdate;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = parseInt(req.body.phone);
  const numParticipants = parseInt(req.body.numParticipants);
  const sewingpreferenceid = parseInt(req.body.sewingPreference);
  const totalproduced = req.body.totalproduced;
  const streetaddress = req.body.streetaddress;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;
  const eventStart = req.body.eventStart;
  const eventDuration = req.body.eventDuration;
  const jenStory = req.body.jenStory === 'true';
  const eventstatusid = parseInt(req.body.eventstatus);
  const eventdetails = req.body.eventdetails;
  // Update the Pokémon in the database
  knex('events')
    .where('eventid', eventid)
    .update({
      confirmedeventdate: confirmedeventdate,
      eventaddressid: eventaddressid,
      totalproduced: totalproduced,
      numparticipants: numParticipants,
      sewingpreferenceid: sewingpreferenceid,
      eventstart:eventStart,
      eventdduration:eventDuration,
      jenStory:jenStory,
      eventstatusid: eventstatusid,
      eventdetails:eventdetails

    })
    .then(() => {
      // After updating the volunteer, update the address table
      return knex('address')
        .where('addressid', addressid) // Use the correct addressid
        .update({
          streetaddress:streetaddress,
          city:city,
          state:state,
          zip:zip,
        });
    })
    .then(() => {
      return knex('eventcontacts')
        .where('contactid', contactid)
        .update({
          contact_first: firstname,
          contact_last: lastname,
          contactphone: phone
          })
      res.redirect('/eventManagment'); // Redirect to the list of Pokémon after saving
    })
    .catch(error => {
      console.error('Error updating event:', error);
      res.status(500).send('Internal Server Error');
    });
});

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


app.post('/EventRequestForm', async (req, res) => {
  try {
    // Extract data from the form submission
    const {
      firstName,
      lastName,
      email,
      phone,
      numParticipants,
      sewingPreference,
      eventDateType: primaryDate,
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

      console.log(
        first_name,
        last_name,
        email,
        phone_number,
        heardaboutid,
        hours_per_month,
        sewinglevelid,
        sewingpreferenceid,
        city,
        state,
        zip
      )
      knex("address")
        .insert({
          city: city,
          state: state,
          zip: zip
        })
        .returning('addressid') // Replace 'id' with the actual name of your address table's ID column
        .then(([newAddressId]) => {
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
