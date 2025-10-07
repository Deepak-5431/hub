import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      user {
        id
        email
        createdAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        email
        createdAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

export const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokens($refreshTokenInput: RefreshTokenInput!) {
    refreshTokens(refreshTokenInput: $refreshTokenInput) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      createdAt
      updatedAt
    }
  }
`;


export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      id
      email
    }
  }
`;

