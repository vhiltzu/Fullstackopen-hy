import { useEffect, useState } from "react";
import personService from "./service";

const Filter = (props) => (
  <div>
    filter shown with <input value={props.filter} onChange={props.onChange} />
  </div>
);

const PersonForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.newName} onChange={props.onNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = (props) => (
  <div>
    {props.persons.map((person) => (
      <Person key={person.name} person={person} />
    ))}
  </div>
);

const Person = (props) => (
  <p>
    {props.person.name} {props.person.number}
  </p>
);

const App = () => {
  // State for the list of persons
  const [persons, setPersons] = useState([]);

  // State for the new name and number input fields
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // State for the filter input field
  const [filter, setFilter] = useState("");

  // Initialize list of persons from server at first render
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

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
      id: persons.length + 1, // Simple id generation for now
      number: newNumber,
    };

    // Send POST request to add the new person
    personService.create(personObject).then((response) => {
      // Update the persons state and reset the newName and newNumber states
      setPersons(persons.concat(response));
      setNewName("");
      setNewNumber("");
    });
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
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleAddPerson}
        newName={newName}
        onNameChange={handleNewNameChange}
        newNumber={newNumber}
        onNumberChange={handleNewNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )}
      />
    </div>
  );
};

export default App;
