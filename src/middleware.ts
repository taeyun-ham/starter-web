// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";
  const isStaticAsset =
    pathname.startsWith("/api") ||
    pathname.startsWith("/avatars") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|webp|ico|txt|xml)$/.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next();
  }

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// middleware.ts 아래에
export const config = {
  matcher: [
    // .svg 등 정적 파일 제외, /api 포함, /login 포함
    "/((?!_next|api|fonts|avatars|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|xml)$).*)",
  ],
};
