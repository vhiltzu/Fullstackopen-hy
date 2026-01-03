import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const SetBirthyearForm = ({ authors, setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure variables are sent as null if empty
    await editAuthor({
      variables: {
        name: name ?? null,
        setBornTo: born ? Number(born) : null,
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="" disabled>
              Select author
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthyearForm;
