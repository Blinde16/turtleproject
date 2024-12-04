// helpers.js

// Example function to retrieve the ID of 'heardAbout' from the database
async function getHeardAboutId(knex, heardAbout) {
    const result = await knex('heardabout') // Make sure 'heardabout' is correct
      .select('heardaboutid')
      .where('description', heardAbout)  
      .first();
  
    // Log the result to check the output
    console.log('Heard about result:', result);
  
    if (result) {
      return result.heardaboutid;  // Ensure you return the correct column
    } else {
      console.error(`No ID found for heardAbout: ${heardAbout}`);
      return null;
    }
  }
  
  
  
  // Example function for sewing level
  async function getSewingLevelId(knex, sewingLevelDescription) {
    const result = await knex('sewinglevel')
      .select('sewinglevelid')
      .where('description', sewingLevelDescription)
      .first();
  
    // Log the actual result object to see its contents
    console.log('Sewing Level result:', result);
  
    return result?.sewinglevelid;  // Ensure you're returning 'sewinglevelid'
  }
  

 // Example function for sewing preference
 async function getSewingPreferenceId(knex, sewingPreferenceDescription) {
    const result = await knex('sewingpreference')
      .select('sewingpreferenceid')
      .where('description', sewingPreferenceDescription)
      .first();
  
    // Log the actual result object to see its contents
    console.log('Sewing Preference result:', result);
  
    return result?.sewingpreferenceid;  // Ensure you're returning 'sewingpreferenceid'
  }
  
  
  // Example function to insert an address
  async function insertAddress(knex, street, city, state, zip) {
    console.log('Data to insert:', { street, city, state, zip });
  
    if (!street || !city || !state || !zip) {
      console.error('Missing required fields:', { street, city, state, zip });
      return; // Early return if any required field is missing
    }
  
    try {
      const result = await knex('address')
        .insert({
          streetaddress: street,  // Match the column name in the database
          city: city,
          state: state,
          zip: zip
        })
        .returning('addressid');  // Return the addressid after insert
  
      console.log('Insert result:', result);
      return result[0].addressid;  // The first element in the array should have the addressid
    } catch (error) {
      console.error('Error inserting address:', error);
      throw error;  // Re-throw the error after logging it
    }
  }
  
  
  module.exports = { getHeardAboutId, getSewingLevelId, getSewingPreferenceId, insertAddress };
  