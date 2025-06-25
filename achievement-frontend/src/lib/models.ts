export type Achievement = {
    id: number,
    name: string,
    description: string,
    image_url: string,
}

export type User = {
    id: number,
    name: string,
    email: string,
    is_admin: boolean,
}
