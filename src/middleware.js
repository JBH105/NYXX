import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";
export default function middleware(request) {
    // Accessing the "token" cookie directly from the request
    let user = request.cookies.get("user");
    console.log("user",user)
    let userData=null;
    if(user?.value){
         userData=JSON.parse(user?.value)
    }
    console.log("userData",userData)
    if (userData !=null && (request.nextUrl.pathname.startsWith("/auth") ) || request.nextUrl.pathname=="/") {
        return NextResponse.redirect(new URL("/user/my-documents", request.url));
    }
    // Redirect if no token is found
    if (userData==null && (request.nextUrl.pathname.startsWith("/user"))) {
        return NextResponse.redirect(new URL("/auth/sign-in/default", request.url));
    }
    // Proceed if token exists
    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}