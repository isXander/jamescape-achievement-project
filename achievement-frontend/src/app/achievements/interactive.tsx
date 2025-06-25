"use client";

import {useState} from "react";
import {backend} from "@/lib/fetch";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {Achievement} from "@/lib/models";
import {Plus} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export function SuggestButton() {
    const [suggestion, setSuggestion] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function submitSuggestion(suggestion: string) {
        return backend<{ message: string }>("/suggestion", {
            method: "POST",
            body: JSON.stringify({ suggestion })
        });
    }

    const handleSubmit = async () => {
        if (!suggestion.trim()) return;
        setSubmitting(true);
        await submitSuggestion(suggestion);
        setSubmitting(false);
        setSubmitted(true);
        setSuggestion("");
        setTimeout(() => setSubmitted(false), 1500);
    };

    return (
        <div className="flex flex-row justify-end w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="hover:cursor-pointer">Suggest achievement</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="flex flex-col justify-start gap-4">
                        <div className="space-y-2">
                            <h4 className="leading-none font-medium">Suggest achievement</h4>
                            <p className="text-muted-foreground text-sm">Give the admins a suggestion to add a new achievement.</p>
                        </div>
                        <Input
                            id="suggestion"
                            value={suggestion}
                            onChange={e => setSuggestion(e.target.value)}
                            disabled={submitting}
                            placeholder="Describe your achievement idea..."
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || !suggestion.trim()}
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </Button>
                        {submitted && <span className="text-green-600 text-sm">Suggestion sent!</span>}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export function AddNewAchievementButton() {
    const form = useForm<Achievement>();

    function onSubmit(data: Achievement) {

    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Plus />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Name"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Description"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}
