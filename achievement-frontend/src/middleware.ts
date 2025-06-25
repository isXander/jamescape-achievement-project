import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export default async function middleware(request: NextRequest) {
    const apiToken = (await cookies()).get('api_token');

    if (!apiToken && !request.nextUrl.pathname.startsWith('/login')) {
        // If no token is found, redirect to the login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists, continue with the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match everything except:
         *  - Next internals (_next)
         *  - static files (e.g. .css, .js, .svg in /static)
         *  - API routes
         *  - favicon
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
