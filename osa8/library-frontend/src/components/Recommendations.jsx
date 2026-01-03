import { useQuery } from "@apollo/client/react";

import { RECOMMENDATION_BOOKS } from "../queries";

const Recommendations = ({ show }) => {
  const result = useQuery(RECOMMENDATION_BOOKS);

  if (!show) {
    return (
      <div>
        <h2>Recommendations</h2>
        <p>Please log in to see recommendations.</p>
      </div>
    );
  }

  if (result.loading) {
    return (
      <div>
        <h2>Recommendations</h2>
        <div>loading...</div>
      </div>
    );
  }

  const books = result.data.me.recommendedBooks;

  return (
    <div>
      <h2>Recommendations</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
