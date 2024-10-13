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

  const { data } = await verifyToken(token);
  if (!data) {
    console.log("User verification failed, redirecting to signin");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  const { role, isAdminApproved } = data;
  console.log("User role:", data.role);

  if (isPublicPath && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${role}/dashboard`, req.nextUrl.origin)
    );
  }

  if (isLoggedIn && !isPublicPath) {
    if (!isAdminApproved) {
      console.log("User is not approved, redirecting to not-approved");
      return NextResponse.redirect(
        new URL("/not-approved", req.nextUrl.origin)
      );
    }

    console.log("User is approved, allowing access to the requested path");
    return NextResponse.next();
  }

  if (!isPublicPath && !isLoggedIn) {
    console.log("Not logged in, redirecting to signin");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
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
