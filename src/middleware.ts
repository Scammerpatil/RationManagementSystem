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

  const token = req.cookies.get("token")?.value || "";
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to public login page");
    return NextResponse.redirect(new URL("/public-login", req.nextUrl.origin));
  }

  if (isLoggedIn) {
    const { user } = await verifyToken(token);
    if (!user) {
      console.log("Token verification failed, redirecting to login");
      return NextResponse.redirect(
        new URL("/public-login", req.nextUrl.origin)
      );
    }

    const { role, isAdminApproved } = user;

    if (isAdminApproved) {
      const dashboardPath = `/${role}/dashboard`;

      if (isPublicPath) {
        return NextResponse.redirect(
          new URL(dashboardPath, req.nextUrl.origin)
        );
      }

      return NextResponse.next();
    }

    if (!isAdminApproved) {
      console.log("User is not admin approved, redirecting to 'not-approved'");
      return NextResponse.redirect(
        new URL("/not-approved", req.nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
}

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
