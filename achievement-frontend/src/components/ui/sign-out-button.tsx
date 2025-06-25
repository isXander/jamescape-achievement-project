"use client";

import {Button} from "@/components/ui/button";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

export function SignOutButton() {
    const router = useRouter();

    function signOut() {
        Cookies.set("api_token", "", { expires: -1 }); // Clear the API token cookie
        router.push("/login")
    }

    return (
        <Button variant="destructive" onClick={() => signOut()}>
            Sign Out
        </Button>
    )
}
