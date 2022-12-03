import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      saveBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

