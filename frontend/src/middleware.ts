import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import CookieManager from "./utils/cookie_manager";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Get token from cookies
  const role = req.cookies.get("role")?.value
  const isAuthPage = req.nextUrl.pathname.startsWith("/login"); // Check if on login page

//   If user is logged in and visits login, redirect them away
  if (token && isAuthPage) {

    const redirectUrl = req.nextUrl.searchParams.get("redirect");

    if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url)); //Send to intended page
      }
    return NextResponse.redirect(new URL(role === "tutor" ? "/Tutor" : "/Projects", req.url));
  }

  // Protect /Tutor pages
  if (!token && req.nextUrl.pathname.startsWith("/Tutor")) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname); // Preserve intended page
    return NextResponse.redirect(redirectUrl);
  }

  // If a student tries to access /Tutor, redirect them
  if (token && role === "student" && req.nextUrl.pathname.startsWith("/Tutor")) {
    return NextResponse.redirect(new URL("/Projects", req.url));
  }

  // if (token && role === "tutor" && req.nextUrl.pathname.startsWith("/")) {
  //   return NextResponse.redirect(new URL("/Projects", req.url));
  // }

  return NextResponse.next();
}

// Apply middleware only to specific paths
export const config = {
  matcher: ["/Tutor/:path*",
             "/login",
             "/Projects",
             "/Proposals",
             "/Choices"

            ], // Protect proposals & check login
};
