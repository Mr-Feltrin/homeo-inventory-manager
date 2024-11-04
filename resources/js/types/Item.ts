export type Item = {
    id: number;
    name: string;
    image?: string | File | null;
    amount: number;
    details?: string;
    category_id: number;
    category_name?: string;
    container_id: number;
    container_name?: string;
    room_id: number;
    room_name?: string;
    created_at?: string;
    updated_at?: string;
};

export type ItemFormType = Omit<Item, "id" | "container_id" | "room_id" | "category_id" | "amount"> & {
    id?: number;
    container_id?: number;
    room_id?: number;
    category_id?: number;
    amount?: number;
};
