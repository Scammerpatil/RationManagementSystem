import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface User {
  role: string;
  isAdminApproved: boolean;
  email?: string;
}

const verifyToken = async (token: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/verifytoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error("Token verification failed");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response was not JSON");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicPath = [
    "/",
    "/public-login",
    "/fps-login",
    "/tehsil-login",
    "/ration/new",
    "/not-approved",
    "/fps/register",
    "/tehsil/register",
    "/admin/register",
    "/admin/login",
  ].includes(pathname);

  // Check if a token is present in cookies
  const token = req.cookies.get("token")?.value || "";
  const isLoggedIn = !!token;

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to public login page");
    return NextResponse.redirect(new URL("/public-login", req.nextUrl.origin));
  }

  // If logged in, verify token
  if (isLoggedIn) {
    const user = await verifyToken(token);

    // If token is invalid, redirect to login page
    if (!user) {
      console.log("Token verification failed, redirecting to login");
      return NextResponse.redirect(
        new URL("/public-login", req.nextUrl.origin)
      );
    }

    const { role, isAdminApproved } = user;
    console.log("User role:", role);

    // Redirect to appropriate dashboard if the user is admin approved
    if (isAdminApproved) {
      const dashboardPath = `/${role}/dashboard`;

      // If user is trying to access a public page while logged in, redirect to their dashboard
      if (isPublicPath) {
        return NextResponse.redirect(
          new URL(dashboardPath, req.nextUrl.origin)
        );
      }

      // If user is logged in and approved, let them proceed to the requested protected route
      return NextResponse.next();
    }

    // If user is logged in but not admin-approved, redirect to the "not-approved" page
    if (!isAdminApproved) {
      console.log("User is not admin approved, redirecting to 'not-approved'");
      return NextResponse.redirect(
        new URL("/not-approved", req.nextUrl.origin)
      );
    }
  }

  // If user is trying to access a public page and is not logged in, allow them access
  return NextResponse.next();
}

// Matcher to define which routes this middleware applies to
export const config = {
  matcher: [
    "/",
    "/public-login",
    "/fps-login",
    "/tehsil-login",
    "/ration/new",
    "/fps/register",
    "/tehsil/register",
    "/admin/register",
    "/admin/login",
    "/user/:path*",
    "/fps/:path*",
    "/tehsil/:path*",
    "/admin/:path*",
  ],
};
