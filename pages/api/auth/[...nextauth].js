import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

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
        // let password = await bcrypt.hash(credentials.password, 10);

        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });

          var compare = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (compare) {
            return user;
          } else {
            return null;
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session(session, token) {
      if (token) session.id = token.id;
      return session;
    },
  },
  session: {
    jwt: true,
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  jwt: {
    secret: process.env.NEXT_PUBLIC_SECRET,
    expiresIn: "1h",
    encryption: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
