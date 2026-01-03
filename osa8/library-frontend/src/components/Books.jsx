import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import { ALL_BOOKS, ALL_BOOKS_GENRES } from "../queries";

const Books = () => {
  const [genre, setGenre] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: genre && { genre },
  });

  if (result.loading) {
    return (
      <div>
        <h2>books</h2>
        <div>loading...</div>
      </div>
    );
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

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
      <BookGenres setGenre={setGenre} />
    </div>
  );
};

const BookGenres = ({ setGenre }) => {
  const result = useQuery(ALL_BOOKS_GENRES);

  if (result.loading) {
    return null;
  }

  const books = result.data.allBooks;
  const genreSet = new Set();
  books.forEach((b) => b.genres.forEach((g) => genreSet.add(g)));
  const genres = Array.from(genreSet);

  return (
    <div>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  );
};

export default Books;
