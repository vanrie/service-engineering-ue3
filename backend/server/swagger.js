const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Swagger API Documentation for the GuestService Server by Team C',
        },
    },
    apis: ['server.js'], // Specify the path to your server.js file
};

const specs = swaggerJsdoc(options);

module.exports = specs;