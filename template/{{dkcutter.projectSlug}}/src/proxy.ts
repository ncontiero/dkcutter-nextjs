{% if dkcutter.authProvider == "clerk" -%}
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
{% if dkcutter.i18n == "nextIntl" -%}
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
{% endif -%}

// This example protects all routes in your Next.js app except for the public ones.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
const isPublicRoute = createRouteMatcher(["/"]);

{%- if dkcutter.i18n == "nextIntl" %}
const intlMiddleware = createMiddleware(routing);
{%- endif %}

{%- if dkcutter.i18n == "nextIntl" %}
export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return intlMiddleware(req); // if it's a public route, do nothing
  await auth.protect(); // for any other route, require auth
});
{%- else %}
export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return; // if it's a public route, do nothing
  await auth.protect(); // for any other route, require auth
});
{%- endif %}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
{% elif dkcutter.authProvider == "betterAuth" -%}
import { getSessionCookie } from "better-auth/cookies";
{%- if dkcutter.i18n == "nextIntl" %}
import createMiddleware from "next-intl/middleware";
{%- endif %}
import { type NextRequest, NextResponse } from "next/server";
{%- if dkcutter.i18n == "nextIntl" %}
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
{%- endif %}

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

{%- if dkcutter.i18n == "nextIntl" %}
  return intlMiddleware(request);
{%- else %}
  return NextResponse.next();
{%- endif %}
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api|trpc|icon|og|robots|manifest.webmanifest|sitemap|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
  ],
};
{% elif dkcutter.authProvider == "none" and dkcutter.i18n == "nextIntl" -%}
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api|trpc|icon|og|robots|manifest.webmanifest|sitemap|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
  ],
};
{% endif -%}
