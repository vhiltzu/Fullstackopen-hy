const { GraphQLError } = require("graphql");
const { ApolloServerErrorCode } = require("@apollo/server/errors");
const { v1: uuid } = require("uuid");
const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      return await Book.find({
        ...(args.author && { author: args.author }),
        ...(args.genre && { genres: { $all: args.genre } }),
      });
    },
    allAuthors: async () => {
      return await Author.find({}).populate("bookCount");
    },
  },
  Mutation: {
    addBook: async (_, args) => {
      const bookExists = await Book.findOne({
        title: args.title,
        author: args.author,
      });

      if (bookExists) {
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

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, id: uuid() });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: args,
              error,
            },
          });
        }
      }

      const newBook = new Book({ ...args, id: uuid(), author: author._id });

      try {
        return await newBook.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            invalidArgs: args,
            error,
          },
        });
      }
    },
    editAuthor: async (_, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return await author.save();
    },
  },
};

module.exports = resolvers;
