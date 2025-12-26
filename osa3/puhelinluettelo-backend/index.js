const express = require("express");
const app = express();

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

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people<br/><br/>${new Date()}`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  // Check if id is a number
  if (isNaN(id)) {
    response.status(400).send({ error: "malformatted id" });
    return;
  }

  const person = persons.find((person) => person.id === id);

  // If person not found, return 404
  if (!person) {
    response.status(404).end();
    return;
  }

  response.json(person);
});

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
