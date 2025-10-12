"use client";
import { ApolloWrapper } from "@/lib/apollo-client";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
}