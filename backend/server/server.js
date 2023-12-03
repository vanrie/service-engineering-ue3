//backend api server
const express = require('express');
const app = express();
const Mongoclient = require('mongodb').MongoClient;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger'); // Replace with the actual path to your Swagger file

app.use(express.json());
app.use(cors());

const CONNECTION_STRING = 'mongodb+srv://tobiasvie:sRaE2l1Kuj6Jqb9R@guestservice-db.i7jqvbg.mongodb.net/?retryWrites=true&w=majority';
const DATABASENAME = 'guestservice-db';
let database;

// Move the swagger setup here
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(5000, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log('Mongo DB Connection successful');
    });
});


//Methoden...

/**
 * @swagger
 * /api/getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: d1
 *                 email: user@example.com
 *                 firstName: John
 *                 lastName: Doe
 *                 isAdmin: false
 */
app.get('/api/getAllUsers', (request, response)=>{
    database.collection("guestservice-users").find({}).toArray((error,result)=>{
        response.send(result);
    });
})


/**
 * @swagger
 * /api/getUserInfo/{userId}:
 *   get:
 *     summary: Get user information
 *     description: Retrieve information for a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: d1
 *               email: user@example.com
 *               firstName: John
 *               lastName: Doe
 *               isAdmin: false
 */
app.get('/api/getUserInfo/:userId', (request, response) => {
    console.log(request.params);
    const { userId } = request.params;

    database.collection("guestservice-users").findOne(
        { id: userId },
        (error, result) => {
            if (error) {
                console.error("Error getting user info:", error);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json(result);
            }
        }
    );
});


/**
 * @swagger
 * /api/addUser:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: d2
 *             email: newuser@example.com
 *             firstName: Jane
 *             lastName: Doe
 *             password: newPassword
 *             isAdmin: false
 *     responses:
 *       200:
 *         description: User added successfully
 */
app.post('/api/addUser', (request, response) => {
    console.log("Request Body:", request.body);

        const newUser = {
            id: request.body.id,
            email: request.body.email,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            password: request.body.password,
            isAdmin: request.body.isAdmin
        };

    database.collection("guestservice-users").insertOne(newUser, function (error, result) {
        if (error) {
            console.error("Error adding user:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.json("User added successfully");
        }
    });
});


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user by checking the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user@example.com
 *             password: userPassword
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               id: d1
 *               email: user@example.com
 *               firstName: John
 *               lastName: Doe
 *               isAdmin: false
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid credentials
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.post('/api/login', (request, response) => {
    const { email, password } = request.body;

    database.collection("guestservice-users").findOne({ email, password }, (error, result) => {
        if (error) {
            console.error("Error logging in:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            if (result) {
                response.json(result);
            } else {
                console.log(email, password);
                response.status(401).json({ error: "Invalid credentials" });
            }
        }
    });
});


/**
 * @swagger
 * /api/editUser:
 *   put:
 *     summary: Edit user information
 *     description: Update the first name and last name of a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: d1
 *             firstName: NewFirstName
 *             lastName: NewLastName
 *     responses:
 *       200:
 *         description: User edited successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.put('/api/editUser', (request, response) => {
    const { id, firstName, lastName } = request.body;

    database.collection("guestservice-users").updateOne(
        { id: id },
        { $set: { firstName, lastName } },
        (error, result) => {
            if (error) {
                console.error("Error editing user:", error);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json("User edited successfully");
            }
        }
    );
});


/**
 * @swagger
 * /api/getAllEvents:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: d1
 *                 name: Event 1
 *                 type: Miscellaneous
 *                 description: Some description
 *                 date: 2023-01-01T00:00
 *                 participants: []
 *                 maxParticipants: 5
 *               - id: d2
 *                 name: Event 2
 *                 date: 2023-02-01T00:00
 *                 type: Miscellaneous
 *                 description: Some description
 *                 participants: [1, 2]
 *                 maxParticipants: 5
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.get('/api/getAllEvents', (request, response) => {
    database.collection("guestservice-events").find({}).toArray((error, result) => {
        response.send(result);
    });
})


/**
 * @swagger
 * /api/changeEventParticipation/{eventId}:
 *   put:
 *     summary: Change event participation
 *     description: Update the participants of a specific event.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             participants: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Event participation updated successfully
 *       400:
 *         description: Invalid participants list in the request body
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid participants list in the request body
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             example:
 *               error: Event not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.put('/api/changeEventParticipation/:eventId', (request, response) => {
    const { eventId } = request.params;
    const { participants } = request.body; 
    console.log(request);

    // Finde das Event anhand der eventId
    database.collection("guestservice-events").findOne({ id: eventId }, (error, event) => {
        if (error) {
            console.error("Error finding event:", error);
            response.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (!event) {
            response.status(404).json({ error: "Event not found" });
            return;
        }

        if (!participants || !Array.isArray(participants)) {
            response.status(400).json({ error: "Invalid participants list in the request body" });
            return;
        }

        // Aktualisiert die participants-Liste des Events mit den neuen Daten
        event.participants = participants;

        // Aktualisiert das Event in der Datenbank
        database.collection("guestservice-events").updateOne(
            { id: eventId },
            { $set: { participants: event.participants } },
            (updateError, result) => {
                if (updateError) {
                    console.error("Error updating event:", updateError);
                    response.status(500).json({ error: "Internal Server Error" });
                } else {
                    response.json("Event participation updated successfully");
                }
            }
        );
    });
});


//Admin Methods

/**
 * @swagger
 * /api/createEvent:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: d1
 *             name: New Event
 *             date: 2023-12-31T18:00
 *             type: Miscellaneous
 *             description: Some description
 *             participants: []
 *             maxParticipants: 5
 *     responses:
 *       200:
 *         description: Event created successfully
 */
app.post('/api/createEvent', (request, response) => {
    const newEvent = request.body;    

        // Hinzufügen des Events zur Datenbank
        database.collection("guestservice-events").insertOne(newEvent, (error, result) => {
            if (error) {
                console.error("Error creating event:", error);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json("Event created successfully");
            }
        });
});


/**
 * @swagger
 * /api/updateEvent:
 *   put:
 *     summary: Update event
 *     description: Update information for a specific event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: d1
 *             name: UpdatedEventName
 *             description: UpdatedDescription
 *             date: 2023-01-15T20:00
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.put('/api/updateEvent', (request, response) => {
    const updatedEvent = request.body;

    database.collection("guestservice-events").updateOne(
        { id: updatedEvent.id },
        { $set: updatedEvent },
        (error, result) => {
            if (error) {
                console.error("Error updating event:", error);
                response.status(500).json({ error: "Internal Server Error" });
            } else {
                response.json("Event updated successfully");
            }
        }
    );
});


/**
 * @swagger
 * /api/deleteEvent/{eventId}:
 *   delete:
 *     summary: Delete event
 *     description: Delete a specific event by ID.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
app.delete('/api/deleteEvent/:eventId', (request, response) => {
    const eventId = request.params.eventId;

    database.collection("guestservice-events").deleteOne({ id: eventId}, (error, result) => {
        if (error) {
            console.error("Error deleting event:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.json("Event deleted successfully");
        }
    });
});