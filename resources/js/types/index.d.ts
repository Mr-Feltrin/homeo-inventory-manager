export interface User {
    id: number;
    firstName: string;
    lastName: string;
    country: string;
    email: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
