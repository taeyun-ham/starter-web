import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// ✅ 액세스 토큰 만료 시 refresh
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch("http://localhost:8080/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const refreshedTokens = await res.json();

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// ✅ NextAuth 설정
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "EmailLogin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:8080/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loginId: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access_token) {
            return {
              id: data.user_id ?? data.email ?? "user", // 고유 식별자 필요
              email: data.email,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          } else {
            const error_json = JSON.stringify(data);
            // 🎯 표준 오류 응답을 클라이언트로 문자열 전달
            throw new Error(error_json);
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : JSON.stringify(error);
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 처음 로그인할 때
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      // 토큰 유효 시간 만료 여부 체크
      const isExpired = Date.now() >= (token.accessTokenExpires as number);
      if (isExpired) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ GET/POST 핸들러 내보내기
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
