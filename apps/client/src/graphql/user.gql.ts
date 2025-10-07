import { gql } from "@apollo/client";

export const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    users {
      id
      email
      createdAt
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: String!) {
    userById(id: $id) {
      id
      email
      createdAt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($userId: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(userId: $userId, updateUserInput: $updateUserInput) {
      id
      email
      updatedAt
    }
  }
`;


export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($updateUserInput: UpdateUserInput!) {
    updateMyProfile(updateUserInput: $updateUserInput) {
      id
      email
      updatedAt
    }
  }
`;
