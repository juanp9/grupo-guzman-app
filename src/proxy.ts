import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (!isLoggedIn && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/propiedades", req.url));
  }
});

export const config = {
  // Excluye archivos estáticos, imágenes y el handler de NextAuth
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|catalogo).*)"],
};
