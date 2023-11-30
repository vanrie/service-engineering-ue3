//backend api server

var express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors=require("cors");

var app = express();
app.use(express.json())
app.use(cors());

var CONNECTION_STRING="mongodb+srv://GuestService:oUeaXHjiZlx1MYDj@cluster0.uqiuixp.mongodb.net/?retryWrites=true&w=majority";

var DATABASENAME="guestservice-db";
var database;

app.listen(5000, ()=> {
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection successful");
    })
})

//Methoden...
app.get('/api/getAllUsers', (request, response)=>{
    database.collection("guestservice-users").find({}).toArray((error,result)=>{
        response.send(result);
    });
})

app.get('/api/getAllEvents', (request, response)=>{
    database.collection("guestservice-events").find({}).toArray((error,result)=>{
        response.send(result);
    });
})

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


//Admin Methods

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