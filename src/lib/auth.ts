import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;
        return { id: String(user.id), name: user.username, email: user.email };
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';
      if (isAdminPath && !isLoginPage && !auth) {
        return Response.redirect(new URL('/admin/login', nextUrl));
      }
      return true;
    },
  },
});
