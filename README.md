# Volunteer and Event Management System

This project is a **Node.js-based web application** designed to manage volunteers and events for an organization. The application features a user-friendly interface for creating, viewing, editing, and deleting data related to volunteers and events.

## Features

### 1. **Volunteer Management**
   - View all volunteers, sorted by last name and first name.
   - Add new volunteers to the database.
   - Edit volunteer details such as contact information, sewing preferences, and availability.
   - Delete volunteers with confirmation to prevent accidental removal.
   - Filter and search volunteers by sewing preference for easy data access.

### 2. **Event Management**
   - Display a table of scheduled events with key details like date, location, and number of participants.
   - Add new events using a dedicated form.
   - Edit event details such as contact information, event description, and participant numbers.
   - Delete events with confirmation prompts.
   - Filter and search events by event status or date.

### 3. **Dynamic Interactions**
   - Fully interactive tables with filtering and search functionalities for both volunteers and events.
   - Alerts for successful actions like deleting a record.
   - Dropdown menus for selecting sewing preferences or event statuses dynamically populated from the database.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Create a PostgreSQL database and populate it with the necessary tables and sample data.
   - We have the create, and fake insert scripts along with the ERD to make it easy to start using
   - 
   - The schema includes tables for volunteers, events, sewing preferences, addresses, and more.
   - Update the `knexfile.js` configuration with your database credentials.

4. **Start the application:**
   ```bash
   npm start
   ```
   The application will run on `http://localhost:5500` by default.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript, EJS templating engine
- **Database:** PostgreSQL with Knex.js query builder

## Folder Structure
.
├── css/                    # contains the index css styling
├── js/                     # contains javascript code to help with certain post routes
├── views/                  # EJS templates for rendering pages
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## Usage

### Volunteer Management
1. Navigate to `/volunteerManagement`.
2. View and manage volunteer records.
3. Add or edit volunteer details using the provided forms.

### Event Management
1. Navigate to `/eventManagement`.
2. View event schedules and details.
3. Add new events or update existing ones.

## Future Enhancements
- Add role-based authentication for admin and user access.
- Enhance search and filter functionalities for advanced queries.
- Integrate email notifications for volunteers and event reminders.
- Volunteer availability tracking
- Expanding availability into other states, different geographical regions
- Distribution tracking of products made
- Volunteer signup for events, assign volunteers to events and manage those signups

## Contributing
Key contributors include:
Jason Nouanounou, Porter Lyman, Hudson Roney, Blake Linde

## Acknowledgments
- Open-source libraries and frameworks that made this project possible.
- Community support and documentation for Node.js, Knex.js, and PostgreSQL.

---

Enjoy managing your volunteers and events efficiently!
