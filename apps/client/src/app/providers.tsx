"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { getClient } from "../lib/apollo-client";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={getClient as unknown as () => any}>{children}</ApolloNextAppProvider>;
}
