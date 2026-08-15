import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  // 👇 Security Checkpoint: Sirf allowed email hi andar jayegi 👇
  callbacks: {
    async signIn({ user }) {
      // "aapki-email@gmail.com" ko hata kar apni asli Gmail id yahan likh dein
      const allowedEmails = ["rishiraj260706@gmail.com"]

      if (user.email && allowedEmails.includes(user.email)) {
        return true // ✅ Authorized: Andar aane do
      } else {
        return false // ❌ Unauthorized: Bahar nikal do
      }
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', 
  }
})

export { handler as GET, handler as POST }