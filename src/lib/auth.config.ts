import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isAdminPath && !isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL('/admin/login', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Empty array to satisfy configuration type requirements
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
