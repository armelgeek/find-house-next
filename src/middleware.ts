import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });

    if (token?.error === "RefreshAccessTokenError") {
      // Redirect to the new error handling route
      return NextResponse.redirect(
        new URL("/api/auth/error?error=RefreshAccessTokenError", req.url)
      );
    }

    const publicRoutes = ["/", '/login', "/about", "/contact", "/faq", "/legal", "/privacy"];
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
    const isAuth = !!token;


    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (!isAuth) {
      // Si on est déjà sur /login, ne pas rediriger (évite la boucle)
      if (req.nextUrl.pathname === "/login") {
        return NextResponse.next();
      }
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Autoriser l'accès aux utilisateurs authentifiés
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Always run this middleware
    },
  }
);

// Matcher configuration remains the same
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
