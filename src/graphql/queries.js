/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDream = /* GraphQL */ `
  query GetDream($id: ID!) {
    getDream(id: $id) {
      id
      name
      date
      location
      theme
      description
      interpertation
      user
      createdAt
      updatedAt
    }
  }
`;
export const listDreams = /* GraphQL */ `
  query ListDreams(
    $filter: ModelDreamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDreams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        date
        location
        theme
        description
        interpertation
        user
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
