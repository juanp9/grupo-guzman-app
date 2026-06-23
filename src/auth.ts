import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = (credentials.username as string).trim();
        const password = (credentials.password as string).trim();

        const validUser = process.env.ADMIN_USERNAME?.trim();
        const validPass = process.env.ADMIN_PASSWORD?.trim();

        if (!validUser || !validPass) return null;
        if (username !== validUser || password !== validPass) return null;

        return { id: "admin", name: "Administrador", email: username };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
