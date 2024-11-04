import { AxiosInstance } from "axios";
import ziggyRoute from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        inertia: {
            update: (data: { props: unknown }) => void;
        };
    }

    interface String {
        capitalizeFirstLetter(): string;
    }

    let route: typeof ziggyRoute;
}
