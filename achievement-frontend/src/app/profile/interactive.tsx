"use client";

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {User} from "@/lib/models";
import {useForm} from "react-hook-form";

export function SettingsDialog({ user }: { user: User }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<{ name: string }>({
        defaultValues: { name: user.name }
    })

    async function onSubmit(data: { name: string }) {
        console.log(data)
        console.log(user.id)
        try {
            // Use the new server-side API route instead of direct API call
            const response = await fetch(`/api/user/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: data.name }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog>

                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Settings />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register('name', {
                                    required: "Name is required",
                                    minLength: { value: 3, message: "Name must be at least 3 characters long" },
                                })}
                            />
                        </div>
                        {errors.name && (
                            <span className="col-span-4 text-sm text-red-600">{errors.name.message}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                    </form>
                </DialogContent>

        </Dialog>
    )
}
