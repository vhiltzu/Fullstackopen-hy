const { GraphQLError } = require("graphql");
const { ApolloServerErrorCode } = require("@apollo/server/errors");
const { PubSub } = require("graphql-subscriptions");
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  // Queries
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      return await Book.find({
        ...(args.author && { author: args.author }),
        ...(args.genre && { genres: { $all: args.genre } }),
      }).populate("author");
    },
    allAuthors: async () => {
      return await Author.find({});
    },
    me: async (_, __, context) => {
      return context.currentUser;
    },
  },

  // Mutations
  Mutation: {
    addBook: async (_, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const bookExists = await Book.exists({
        title: args.title,
      });

      if (bookExists) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            invalidArgs: args.title,
          },
        });
      }

      const authorExists = await Author.exists({ name: args.author });
      let author;
      if (authorExists) {
        author = await Author.findOne({ name: args.author });
      } else {
        try {
          author = new Author({ name: args.author, id: uuid() });
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const newBook = new Book({ ...args, id: uuid(), author: author.id });

      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            invalidArgs: args.title,
            error,
          },
        });
      }

      const bookAdded = await newBook.populate("author");

      await pubsub.publish("BOOK_ADDED", { bookAdded });
      return bookAdded;
    },
    editAuthor: async (_, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return await author.save();
    },
    createUser: async (_, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  // Subscriptions
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },

  // Extended types
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root.id });
    },
  },
  User: {
    recommendedBooks: async (root) => {
      return await Book.find({ genres: { $all: root.favoriteGenre } }).populate(
        "author"
      );
    },
  },
};

module.exports = resolvers;
