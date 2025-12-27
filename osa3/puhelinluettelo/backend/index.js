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
    response.status(400).json({ error: "name missing" });
    return;
  }

  if (!body.number) {
    response.status(400).json({ error: "number missing" });
    return;
  }

  // Check for unique name
  Person.findOne({ name: body.name }).then((existingPerson) => {
    if (existingPerson !== null) {
      response.status(400).json({ error: "name must be unique" });
      return;
    }

    // Create new person object
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson.save().then((savedPerson) => {
      response.status(201).json(savedPerson);
    });
  });
});

// Update an existing person
app.put("/api/persons/:id", express.json(), (request, response) => {
  const body = request.body;

  // Validate number
  if (!body.number) {
    response.status(400).json({ error: "number missing" });
    return;
  }

  // Check for unique name
  Person.findByIdAndUpdate(
    request.params.id,
    { number: body.number },
    { new: true }
  ).then((updatedPerson) => {
    if (updatedPerson !== null) {
      response.status(201).json(updatedPerson);
      return;
    }
  });
});

// Delete person by ID
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
