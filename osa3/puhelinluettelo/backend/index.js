const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./person");

require("dotenv").config();

// Initialize express app
const app = express();

const requestLogger = (request, response, next) => {
  morgan.token("req-body", (req, res) => JSON.stringify(req.body));
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )(request, response, next);
};

// Middlewares
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// Info endpoint
app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people<br/><br/>${new Date()}`
  );
});

// Get all persons
app.get("/api/persons", (request, response, next) =>
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => next(err))
);

// Get person by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((err) => next(err));
});

// Create a new person
app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  // Check for unique name
  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        response.status(400).json({ error: "name must be unique" });
        return;
      }

      // Create new person object
      const newPerson = new Person({
        name,
        number,
      });

      newPerson
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// Update an existing person
app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  // Validate number
  if (!number) {
    response.status(400).json({ error: "number missing" });
    return;
  }

  // Check for unique name
  Person.findByIdAndUpdate(request.params.id, { number })
    .then((updatedPerson) => {
      if (updatedPerson !== null) {
        response.json(updatedPerson);
      }
    })
    .catch((err) => next(err));
});

// Delete person by ID
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
