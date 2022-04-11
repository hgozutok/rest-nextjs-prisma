import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../lib/prisma";

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = await prisma.user.findUnique({
        //   where: {
        //     username: credentials.username,
        //   },
        // });
        return { id: 1, name: "J Smith", email: "jsmith@example.com" };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  //   callbacks: {
  //     async jwt({ token, user }) {
  //       if (user) token.id = user.id;
  //       return token;
  //     },
  //     session(session, token) {
  //       if (token) session.id = token.id;
  //       return session;
  //     },
  //   },
  //   session: {
  //     jwt: true,
  //   },
  secret: process.env.NEXT_PUBLIC_SECRET,
  //   jwt: {
  //     secret: process.env.NEXT_PUBLIC_SECRET,
  //     expiresIn: "1h",
  //     encryption: true,
  //   },
};

export default (req, res) => NextAuth(req, res, options);
