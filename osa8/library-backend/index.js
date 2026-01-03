const { ApolloServer, GraphQLError } = require("@apollo/server");
const { ApolloServerErrorCode } = require("@apollo/server/errors");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (_, args) => {
      const filters = [];

      // Apply author filter if provided
      if (args.author) {
        filters.push((book) => book.author === args.author);
      }

      // Apply genre filter if provided
      if (args.genre) {
        filters.push((book) => book.genres.includes(args.genre));
      }

      // Filter books based on the accumulated filters if there are any filters applied
      return books.filter((book) =>
        filters.every((filterFunc) => filterFunc(book))
      );
    },
    allAuthors: () =>
      authors.map((author) => ({
        ...author,
        // Calculate bookCount using the authors' names due the lack of author IDs in books
        bookCount: books.filter((book) => book.author === author.name).length,
      })),
  },
  Mutation: {
    addBook: (_, args) => {
      if (
        books.find((p) => p.title === args.title && p.author === args.author)
      ) {
        throw new GraphQLError(
          `Title and author must be unique: ${args.title}`,
          {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: [args.title, args.author],
            },
          }
        );
      }

      const newBook = { ...args, id: uuid() };
      books.push(newBook);

      // Check if the author already exists
      if (!authors.find((author) => author.name === args.author)) {
        authors.push({
          name: args.author,
          id: uuid(),
        });
      }

      return newBook;
    },
    editAuthor: (_, args) => {
      const author = authors.find((a) => a.name === args.name);

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
