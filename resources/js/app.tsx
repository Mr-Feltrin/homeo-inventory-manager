/* eslint-disable @typescript-eslint/no-explicit-any */
import "./bootstrap";
import "../css/app.css";
import "./utils/TextUtils";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "Homeo";

type AppModule = {
    default: React.ComponentType & { layout?: React.ComponentType };
}

createInertiaApp({
    title: title => (title ? `${title} - ${appName}` : appName),
    resolve: async name => {
        return resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob("./Pages/**/*.tsx")).then((page: unknown) => {
            (page as AppModule).default.layout = name.startsWith("Public/") || name.startsWith("Auth/") ? (page as any) : (page: any) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
            return page;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#84cc16"
    }
});
