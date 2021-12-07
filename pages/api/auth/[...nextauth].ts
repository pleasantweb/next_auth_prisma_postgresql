import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email";
import { NextApiRequest,NextApiResponse } from "next";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function auth(req:NextApiRequest,res:NextApiResponse){
    return await NextAuth(req,res,{
        adapter: PrismaAdapter(prisma),
        providers:[
            GithubProvider({
                clientId:process.env.GITHUB_ID,
                clientSecret:process.env.GITHUB_SECRET
            }),
            EmailProvider({
                server: process.env.EMAIL_SERVER,
                from: process.env.EMAIL_FROM
              }),
        ],
        pages:{
            signIn:'/auth/signin'
        },
        secret:process.env.AUTH_SECRET,
        session: {
            strategy:'jwt'
        },
        jwt:{
            secret:process.env.JWT_SECRET
        },
        debug:process.env.NODE_ENV === 'development',
        callbacks:{
            async signIn({ user, account, profile, email, credentials }) {
                const isAllowedToSignIn = user.email === process.env.ADMIN_EMAIL
                if (isAllowedToSignIn) {
                  return true
                } else {
                  // Return false to display a default error message
                  return false
                  // Or you can return a URL to redirect to:
                  // return '/unauthorized'
                }
              }
        },
        // events:{
        //     signIn:({user,account,profile,isNewUser})=>{
        //         console.log('user',user);
        //         console.log('account',account);
        //         console.log('profile',profile);
        //         console.log('isNew USer',isNewUser);
                 
        //     }
        // }
    
    })
} 