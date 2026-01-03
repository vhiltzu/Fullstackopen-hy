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
      }).populate("author");
    },
    allAuthors: async () => {
      return await Author.find({});
    },
  },
  Mutation: {
    addBook: async (_, args) => {
      const bookExists = await Book.exists({
        title: args.title,
      });

      if (bookExists) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            invalidArgs: [args.title],
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
              invalidArgs: args,
              error,
            },
          });
        }
      }

      const newBook = new Book({ ...args, id: uuid(), author: author.id });

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
