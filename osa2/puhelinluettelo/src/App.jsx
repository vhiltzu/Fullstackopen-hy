import { useState } from "react";

const App = () => {
  // State for the list of persons
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);

  // State for the new name and number input fields
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // State for the filter input field
  const [filter, setFilter] = useState("");

  const handleAddPerson = (event) => {
    event.preventDefault();

    // Check for duplicate names
    const exists = persons.find((person) => person.name === newName);
    if (exists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    // Create a new person object
    const personObject = {
      name: newName,
      number: newNumber,
    };

    // Update the persons state and reset the newName state
    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleNewNameChange = (event) => {
    // Track the value of the input field
    setNewName(event.target.value);
  };

  const handleNewNumberChange = (event) => {
    // Track the value of the number input field
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    // Track the value of the filter input field
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={handleAddPerson}>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((person) => (
            <p key={person.name}>
              {person.name} {person.number}
            </p>
          ))}
      </div>
    </div>
  );
};

export default App;
