import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For now, using hardcoded credentials
        // Later you can add database check with hashed passwords
        const username = credentials.username as string;
        const password = credentials.password as string;

        // Default credentials (change these!)
        if (username === "admin" && password === "admin123") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
          };
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      
      // Public routes that don't require authentication
      if (pathname === "/login") return true;
      
      // All other routes require authentication
      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
  },
});
