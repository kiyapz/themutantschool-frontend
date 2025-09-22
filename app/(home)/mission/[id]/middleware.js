"use client";
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If trying to access labs or hall of mutants through mission route, redirect to correct path
  if (pathname.includes("/mission/the-lab")) {
    return NextResponse.redirect(new URL("/the-lab", request.url));
  }
  if (pathname.includes("/mission/hall-of-the-mutants")) {
    return NextResponse.redirect(new URL("/hall-of-the-mutants", request.url));
  }

  return NextResponse.next();
}
