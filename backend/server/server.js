//backend api server

var express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors=require("cors");
const multer= require("multer");

var app = express();
app.use(express.json())
app.use(cors());
app.use(multer().none());


var CONNECTION_STRING="mongodb+srv://rienervanessa:hwpgbYmZ8uEa88Df@cluster0.wk3uhju.mongodb.net/?retryWrites=true&w=majority";

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

app.post('/api/AddUser', multer().none(), (request, response) => {
    console.log("Request Body:", request.body);

    database.collection("guestservice-users").count({}, function (error, numOfDocs) {
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
});

app.post('/api/login', multer().none(), (request, response) => {
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

app.put('/api/editUser', multer().none(), (request, response) => {
    const { id, firstName, lastName } = request.body;

    database.collection("guestservice-users").updateOne(
        /*{ _id: ObjectId(id) }, -> es wäre möglich über die Objekt ID das durchzuführen -> bräuchten keine eigene ID*/
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

app.put('/api/changeEventParticipation/:eventId', multer().none(), (request, response) => {
    const { eventId } = request.params;
    const { participants } = request.body; // Annahme: Der Anfrage-Body enthält die aktualisierte participants-Liste

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

app.post('/api/createEvent', multer().none(), (request, response) => {
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

app.put('/api/updateEvent', multer().none(), (request, response) => {
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

    database.collection("guestservice-events").deleteOne({ id:  eventId}, (error, result) => {
        if (error) {
            console.error("Error deleting event:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.json("Event deleted successfully");
        }
    });
});