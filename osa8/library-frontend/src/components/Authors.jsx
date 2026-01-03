import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import SetBirthyearForm from "./SetBirthyearForm.jsx";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return (
      <div>
        <h2>authors</h2>
        <div>loading...</div>
      </div>
    );
  }

  const authors = result.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>
                <Link to={`/authors/${a.id}`}>{a.name}</Link>
              </td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthyearForm authors={authors} />
    </div>
  );
};

export default Authors;
