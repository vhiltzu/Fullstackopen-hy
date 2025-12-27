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
      <Person key={person.name} person={person} onDelete={props.onDelete} />
    ))}
  </div>
);

const Person = (props) => {
  const handleDeleteClick = () => {
    if (window.confirm(`Delete ${props.person.name}?`)) {
      props.onDelete(props.person);
    }
  };

  return (
    <p>
      {props.person.name} {props.person.number}{" "}
      <button onClick={handleDeleteClick}>delete</button>
    </p>
  );
};

const Notification = (props) => {
  if (props.kind === "error") {
    return (
      <div
        style={{
          color: "red",
          background: "lightgrey",
          fontSize: "1.5em",
          padding: "0.33em",
          border: "2px solid red",
          borderRadius: "0.33em",
          margin: "0.5em 0",
        }}
      >
        {props.message}
      </div>
    );
  }

  if (props.kind === "success") {
    return (
      <div
        style={{
          color: "green",
          background: "lightgrey",
          fontSize: "1.5em",
          padding: "0.33em",
          border: "2px solid green",
          borderRadius: "0.33em",
          margin: "0.5em 0",
        }}
      >
        {props.message}
      </div>
    );
  }

  return null;
};

const App = () => {
  // State for the list of persons
  const [persons, setPersons] = useState([]);

  // State for the new name and number input fields
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // State for the filter input field
  const [filter, setFilter] = useState("");

  // State for notifications
  const [notification, setNotification] = useState({ message: "", kind: "" });

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
      // Confirm if the user wants to update the number
      const shouldUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (shouldUpdate) {
        updatePersonNumber(exists.id, newNumber);
      }
      return;
    }

    // Create a new person object
    const personObject = {
      name: newName,
      id: (persons.length + 1).toString(), // Simple id generation for now
      number: newNumber,
    };

    // Send POST request to add the new person
    personService.create(personObject).then((response) => {
      // Update the persons state and reset the newName and newNumber states
      setPersons(persons.concat(response));
      setNewName("");
      setNewNumber("");
      setNotification({
        message: `Added ${personObject.name}`,
        kind: "success",
      });
    })
    .catch((error) => {
      setNotification({
        message: error.response.data.error,
        kind: "error",
      });
    });
  };

  const updatePersonNumber = (id, newNumber) => {
    const person = persons.find((p) => p.id === id);
    const updatedPersonObject = { ...person, number: newNumber };

    // Send PUT request to update the person's number
    personService.update(id, updatedPersonObject).then((updatedPerson) => {
      setPersons(
        persons.map((person) => (person.id === id ? updatedPerson : person))
      );
      setNewName("");
      setNewNumber("");
      setNotification({
        message: `Updated ${updatedPerson.name}'s number`,
        kind: "success",
      });
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

  const handleDeletePerson = (person) => {
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        setNotification({
          message: `Deleted ${person.name}`,
          kind: "success",
        });
      })
      .catch(() => {
        setNotification({
          message: `Information of ${person.name} has already been removed from server`,
          kind: "error",
        });
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} kind={notification.kind} />
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
        onDelete={handleDeletePerson}
      />
    </div>
  );
};

export default App;
