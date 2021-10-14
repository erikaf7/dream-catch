/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDream = /* GraphQL */ `
  mutation CreateDream(
    $input: CreateDreamInput!
    $condition: ModelDreamConditionInput
  ) {
    createDream(input: $input, condition: $condition) {
      id
      name
      date
      location
      theme
      description
      interpertation
      createdAt
      updatedAt
    }
  }
`;
export const updateDream = /* GraphQL */ `
  mutation UpdateDream(
    $input: UpdateDreamInput!
    $condition: ModelDreamConditionInput
  ) {
    updateDream(input: $input, condition: $condition) {
      id
      name
      date
      location
      theme
      description
      interpertation
      createdAt
      updatedAt
    }
  }
`;
export const deleteDream = /* GraphQL */ `
  mutation DeleteDream(
    $input: DeleteDreamInput!
    $condition: ModelDreamConditionInput
  ) {
    deleteDream(input: $input, condition: $condition) {
      id
      name
      date
      location
      theme
      description
      interpertation
      createdAt
      updatedAt
    }
  }
`;
