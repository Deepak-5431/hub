"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/graphql",
      credentials: "include",
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: "all" },
      query: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}
