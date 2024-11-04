export type Container = {
    id?: number;
    name: string;
    details?: string;
    room_name?: string;
    room_id?: number;
    image?: string | File | null;
    total_items?: number;
    created_at?: string;
    updated_at?: string;
};