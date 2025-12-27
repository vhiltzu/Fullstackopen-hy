const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./person");

require("dotenv").config();

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423123",
  },
];

// Initialize express app
const app = express();

// Middleware for logging
morgan.token("req-body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

// Middleware for CORS
app.use(cors());

app.use(express.static("dist"));

// Info endpoint
app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people<br/><br/>${new Date()}`
  );
});

// Get all persons
app.get("/api/persons", (request, response) =>
  Person.find({}).then((persons) => {
    response.json(persons);
  })
);

// Get person by ID
app.get("/api/persons/:id", (request, response) => {
  const person = Person.find((p) => p.id === request.params.id);

  // If person not found, return 404
  if (!person) {
    response.status(404).end();
    return;
  }

  response.json(person);
});

// Create a new person
app.post("/api/persons", express.json(), (request, response) => {
  const body = request.body;

  // Validate name and number
  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  // Check for unique name
  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }

  // Create new person object
  const newPerson = {
    id: Math.ceil(Math.random() * 10 ** 9),
    name: body.name,
    number: body.number,
  };

  // Here could be a check to ensure the id is unique, but the chance of collision is very low

  persons.push(newPerson);
  response.status(201).json(newPerson);
});

// Delete person by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  // Check if id is a number
  if (isNaN(id)) {
    response.status(400).send({ error: "malformatted id" });
    return;
  }

  const i = persons.findIndex((person) => person.id === id);

  // If person not found, return 404
  if (i === -1) {
    response.status(404).end();
    return;
  }

  persons.splice(i, 1);
  response.status(204).end();
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
