import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {User} from "@/lib/models";
import {Achievements} from "@/app/achievements/achievements";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {apiFetch} from "@/lib/api";
import {SignOutButton} from "@/components/ui/sign-out-button";
import {SettingsDialog} from "@/app/profile/interactive";

export default async function ProfilePage() {
    const user: User = await apiFetch<User>('/me');

    if (!user) {
        return (
            <main className="mx-auto max-w-4xl flex flex-col gap-4 p-4">
                <h1 className="text-xl font-medium">Loading...</h1>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl flex flex-col gap-4 p-4">
            <ProfileHero user={user} />
            <AchievementsSection user={user} />
        </main>
    )
}

function ProfileHero({ user }: { user: User }) {
    const initials = user.name
        .trim().toUpperCase()
        .split(" ")
        .map(name => name[0])
        .join("");

    return (
        <div className="flex flex-row justify-between align-center gap-x-4">
            <div className="flex flex-row justify-start gap-4">
                <Avatar className="row-span-2 size-24">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-4 justify-center">
                    <h2 className="font-medium">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="flex justify-row justify-end gap-4">
                <ThemeToggle />
                <SettingsDialog user={user} />
                {user.is_admin && (
                    <Button variant="outline" asChild>
                        <Link href="/admin">Admin Panel</Link>
                    </Button>
                )}
                <SignOutButton />
            </div>

        </div>
    )
}

function AchievementsSection({ user }: { user: User }) {
    return (
        <div>
            <Achievements user={user} />
        </div>
    )
}
