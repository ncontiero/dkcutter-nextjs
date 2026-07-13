{% if dkcutter.authProvider == "clerk" -%}
import { clerkMiddleware } from "@clerk/nextjs/server";
{% if dkcutter.i18n == "nextIntl" -%}
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
{% endif -%}

{%- if dkcutter.i18n == "nextIntl" %}
const intlMiddleware = createMiddleware(routing);
{%- endif %}

{%- if dkcutter.i18n == "nextIntl" %}
export default clerkMiddleware((_, req) => {
  return intlMiddleware(req);
});
{%- else %}
export default clerkMiddleware();
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
