import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//const prisma = new PrismaClient();

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      //  callbackUrl: process.env.GITHUB_CALLBACK_URL,
      //    scope: ["user:email"],
    }),
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
        // const user = await fetch(
        //   process.env.NEXT_PUBLIC_BASE_URL + "/api/user/login",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: {
        //       email: credentials.username,
        //       password: credentials.password,
        //     },
        //   }
        // )
        //   .then((res) => res.json())
        //   .then((data) => data.user);
        // if (!user) {
        //   return null;
        // } else return user;

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.username,
            },
          });

          var compare = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (compare) {
            // let token = jwt.sign(
            //   { userId: user.id },
            //   process.env.NEXT_PUBLIC_SECRET,
            //   {
            //     expiresIn: "1h",
            //   }
            // );
            // let autToken = await prisma.verificationToken.create({
            //   data: {
            //     token: token,
            //     identifier: user.id,
            //     expires: new Date(Date.now() + 60 * 60 * 24),
            //   },
            // });

            return { ...user, password: undefined };
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
    // async jwt({ token, account, accessToken, refreshToken }) {
    //   console.log("token", token);
    //   console.log("account", account);
    //   console.log("accessToken", accessToken);
    //   console.log("refreshToken", refreshToken);
    //   // Persist the OAuth access_token to the token right after signin
    //   if (account) {
    //     token.accessToken = account.access_token;
    //   }
    //   return token;
    // },
    async session({ session, token, account }) {
      let utoken = jwt.sign(
        { userId: token.sub },
        process.env.NEXT_PUBLIC_SECRET,
        {
          expiresIn: "1h",
        }
      );
      await prisma.verificationToken
        .findMany({
          where: {
            identifier: token.sub,
          },
        })
        .then((data) => {
          if (data.expires > Date.now()) {
            prisma.verificationToken.deleteMany({
              where: {
                identifier: token.sub,
              },
            });
          }
        });

      let autToken = await prisma.verificationToken.create({
        data: {
          token: utoken,
          identifier: token.sub,
          expires: new Date(Date.now() + 60 * 60 * 24),
        },
      });

      session.accessToken = utoken;
      console.log("sesaccount", session);
      return session;
    },
  },
  //   callbacks: {
  //     async jwt(token, user) {
  //       if (user) token.id = user.id;
  //       return token;
  //     },
  //     session(session, token) {
  //       if (token) session.id = token.id;
  //       return session;
  //     },
  //   },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,

    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  jwt: {
    secret: process.env.NEXT_PUBLIC_SECRET,
    expiresIn: "1h",
    // encryption: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
