export type Room = {
    id: number | undefined;
    name: string;
    description?: string;
    image?: string | File | null;
    containers_count?: number;
    items_count?: number;
    created_at?: string;
    updated_at?: string;
};

