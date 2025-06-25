"use client";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {API_URL} from "@/lib/constants";
import {useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    const handleAuth = async (isRegister = false, event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        if (isRegister) {
            setIsRegistering(true);
        } else {
            setIsLoading(true);
        }

        setError("");

        try {
            const endpoint = isRegister ? "/register" : "/login";
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name: email.split("@")[0] }),
                credentials: "include",
                mode: "cors",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (isRegister ? "Registration failed" : "Login failed"));
            }

            const data = await response.json();

            // Store the API token in a cookie
            Cookies.set("api_token", data.api_token);

            // Redirect to profile page
            router.push("/profile");
        } catch (err) {
            console.log(err);
            setError(err instanceof Error ? err.message : `An error occurred during ${isRegister ? "registration" : "login"}`);
        } finally {
            if (isRegister) {
                setIsRegistering(false);
            } else {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => handleAuth(false, e);
    const handleRegister = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        return handleAuth(true);
    };

    return (
        <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log in to your account</CardTitle>
                            <CardDescription>Enter your email below to log in to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    {error && (
                                        <div className="text-sm text-red-500 font-medium">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="xander@isxander.dev"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Logging in..." : "Log in"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleRegister}
                                            disabled={isRegistering}
                                            >
                                            {isRegistering ? "Registering..." : "Register"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
