# service-engineering-ue3

To start the Guest Service app, some steps are necessary:

  1. Setup a MongoDB database, named guestservice-db (https://www.mongodb.com/de-de) and save credentials specified for the database, more detailed guide can be found here: https://www.mongodb.com/basics/create-database
  2. Exchange the CONNECTION_STRING in the server.js file, so it fits your connection key
  3. Open a terminal and navigate to the folder /backend/server and run following commands:
         - npm install
         - npm start
  4. Now the backend server should've started on Port 5000 and the console states 'Mongo DB Connection successful'
  5. To start the Front-End, open a terminal and navigate to the folder /frontend/guest-service and run the following commands:
         - npm install
         - npm start
  6. Now the Front-End Server should've been started as well on Port 3000.
  7. To also test the admin functions, create an user with the given Register template first and then manually change the value of 'isAdmin' in your MongoDB to 'true'
