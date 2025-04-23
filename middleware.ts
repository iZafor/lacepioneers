import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "./convex/_generated/api";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/profile(.*)"]);
const isExtraNonAdminRoute = createRouteMatcher(["/checkout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    const adminRoute = isAdminRoute(req);
    const userRoute = isUserRoute(req);
    const extraNonAdminRoute = isExtraNonAdminRoute(req);

    if (!userId && (adminRoute || userRoute)) {
        return redirectToSignIn();
    }

    const isAdmin = userId
        ? await fetchQuery(api.users.isUserAdmin, {
              clerkId: userId,
          })
        : false;

    if (
        (adminRoute && !isAdmin) ||
        ((userRoute || extraNonAdminRoute) && isAdmin)
    ) {
        return NextResponse.redirect(new URL("/", req.url));
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
