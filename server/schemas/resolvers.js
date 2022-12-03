// Imports
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// Declare resolvers
const resolvers = {
  // Query resolvers
  Query: {
    me: async (parent, args, context) => {
      // If user is logged in then find the user using the id of the JWT
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        .select('-__v -password')
        .populate('savedBooks')
      
        return userData;
      }

      // Otherwise send an authentication error
      throw new AuthenticationError('Not logged in');
    }
  },
  // Mutation resolvers
  Mutation: {
    login: async (parent, { email, password }) => {
      // Login using args
      const user = await User.findOne({ email });

      // If no user data is returned, send an authentication error
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Check for correct password
      const correctPw = await user.isCorrectPassword(password);

      // If incorrect password send authentication error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // Sign token and return it
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      // Create user with arguments
      const user = await User.create(args);
      // Create token with user data
      const token = signToken(user);
      // Return data
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      // If the user is logged in then save a book using the saved user ID
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate (
          { _id: context.user._id },
          { $addToSet: {savedBooks: args} },
          { new: true, runValidators: true }
        );
        
        return updatedUser;
      }

      // Send an error if user is not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, { bookId }, context) => {
      // If the user is logged in then delete the book with the provided bookId
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate (
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      // Send an error if the user is not logged in
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

// Export resolvers
module.exports = resolvers;