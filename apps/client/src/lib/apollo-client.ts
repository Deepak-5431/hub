"use client";

import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  NormalizedCacheObject,
  ApolloLink 
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { getAuthStore } from "../store/authStore";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const authLink = new SetContextLink((prevContext, operation) => {
  const token = getAuthStore().accessToken;
  
  return {
    ...prevContext,
    headers: {
      ...(prevContext.headers || {}),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const createClient = () =>
  new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

export const { getClient } = registerApolloClient(() => createClient());