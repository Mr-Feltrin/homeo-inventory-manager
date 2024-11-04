import { useTheme } from "@/hooks/useTheme";
import Sidebar from "./partials/Sidebar";
import { ToastProvider } from "@/Contexts/ToastContext";
import ToastContainer from "@/Components/Toast/ToastContainer";

type AuthenticatedLayoutProps = {
    children: React.ReactNode;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
    useTheme();

    return (
        <ToastProvider>
            <Sidebar />
            <main className="px-4 md:ml-64">{children}</main>
            <ToastContainer />
        </ToastProvider>
    );
};

export default AuthenticatedLayout;
