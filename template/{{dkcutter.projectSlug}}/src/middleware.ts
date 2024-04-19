import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes in your Next.js app except for the public ones.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return; // if it's a public route, do nothing
  auth().protect(); // for any other route, require auth
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
