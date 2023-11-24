//backend api server

var express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors=require("cors");
const multer= require("multer");

var app = express();
app.use(cors());


var CONNECTION_STRING="mongodb+srv://rienervanessa:hwpgbYmZ8uEa88Df@cluster0.wk3uhju.mongodb.net/?retryWrites=true&w=majority";

var DATABASENAME="guestservice-db";
var database;

app.listen(5000, ()=> {
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection successful");
    })
})

app.get('/api/getAllUsers', (request, response)=>{
    database.collection("guestservice-collection").find({}).toArray((error,result)=>{
        response.send(result);
    });
})

app.get('/api/getAllEvents', (request, response)=>{
    database.collection("guestservice-events").find({}).toArray((error,result)=>{
        response.send(result);
    });
})

app.post('/api/AddUser',multer().none(),(request,response)=>{
    database.collection("guestservice-collection").count({},function(error,numOfDocs){
        database.collection("guestservice-collection").insertOne({
            id:(numOfDocs+1).toString(),
            name:request.body.newNotes
        });
        response.json("added Succesfully")
    })
})

app.post('/api/AddEvent', multer().none(), (request, response) => {
    const newEvent = request.body; // Assuming your request body contains the new event details

    database.collection("guestservice-events").insertOne(newEvent, (error, result) => {
        if (error) {
            console.error("Error adding event:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.json("Event added successfully");
        }
    });
});

app.delete('/api/DeleteEvent/:eventId', (request, response) => {
    const eventId = request.params.eventId;

    database.collection("guestservice-events").deleteOne({ _id: ObjectId(eventId) }, (error, result) => {
        if (error) {
            console.error("Error deleting event:", error);
            response.status(500).json({ error: "Internal Server Error" });
        } else {
            response.json("Event deleted successfully");
        }
    });
});


