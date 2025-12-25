import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1231244" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

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

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map((person) => (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
