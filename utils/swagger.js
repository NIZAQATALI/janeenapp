import  path  from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "backend",
      version: "1.0.0",
      description: "MERN-EventsApp backend",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: [
  path.resolve("./routes/*.js"),
    path.resolve("./controllers/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;