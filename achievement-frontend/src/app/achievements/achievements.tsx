import {Achievement, User} from "@/lib/models";
import {Table, TableCaption, TableHead, TableRow, TableHeader, TableBody, TableCell} from "@/components/ui/table";
import Image from "next/image";
import {apiFetch} from "@/lib/api";
import {AddNewAchievementButton, SuggestButton} from "@/app/achievements/interactive";

export async function Achievements({ user }: { user: User }) {
    const index = await apiFetch<Achievement[]>('/achievement')
    const acquired = await apiFetch<Achievement[]>(`/${user.id}/achievements`);

    console.log(acquired);

    const sortedAchievements = index.sort((a: Achievement, b: Achievement) =>
        acquired.some((acquiredAchievement: Achievement) => acquiredAchievement.id === a.id) ? -1 :
            acquired.some((acquiredAchievement: Achievement) => acquiredAchievement.id === b.id) ? 1 :
                0
    );

    return (
        <div>
            <div className="flex flex-row justify-between align-center gap-x-4">
                <h1 className="font-medium text-xl py-3">Achievements</h1>

                {user.is_admin && (
                    <AddNewAchievementButton />
                )}
            </div>

            <Table>
                <TableCaption>A list of your achievements</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Acquired</TableHead>
                        <TableHead>Icon</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedAchievements.map((achievement: Achievement) => (
                        <TableRow key={achievement.id}>
                            <TableCell className="font-medium">{achievement.id}</TableCell>
                            <TableCell>{achievement.name}</TableCell>
                            <TableCell>{achievement.description}</TableCell>
                            <TableCell>{acquired.map((a: Achievement) => a.id).includes(achievement.id) ? "Yes" : "No"}</TableCell>
                            <TableCell><Image src={achievement.image_url} alt="achievement image" width={30}
                                              height={30}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <SuggestButton />
        </div>
    )
}


