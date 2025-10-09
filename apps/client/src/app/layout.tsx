import "./globals.css";
import Providers from "./providers";
import { ReactNode } from "react";

export const metadata = {
  title: "Next.js + NestJS GraphQL",
  description: "Frontend for NestJS GraphQL API",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
