// Imports
const { gql } = require('apollo-server-express');

// Initialize type definitions
const typeDefs = gql`
  type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], description: String!, bookId: String!, image: String, link: String, title: String!): User
    deleteBook(bookId: String!): User
  }
`;

// Export type definitions
module.exports = typeDefs;