import AppLogo from "@/Components/AppLogo";
import NavLink from "@/Layouts/partials/NavLink";
import { useTheme } from "@/hooks/useTheme";
import useApi from "@/hooks/useApi";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { theme, SwitchTheme } = useTheme();

    const { submit } = useApi();

    const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        e.preventDefault();
        submit(route("logout"), "POST").then(() => {
            window.location.href = route("welcome");
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            )}

            <aside id="sidebar" className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform ${isSidebarOpen ? "" : "-translate-x-full md:translate-x-0"}`}>
                <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
                    <AppLogo target="_blank" href={route("dashboard")} onClick={() => setIsSidebarOpen(false)} classList="pb-4 border-b border-gray-200 dark:border-gray-700" />

                    <ul className="space-y-2 font-medium flex-grow">
                        <li>
                            <NavLink title="Dashboard" onClick={() => setIsSidebarOpen(false)} active={route().current("dashboard")} href={route("dashboard")} />
                        </li>
                        <li>
                            <NavLink title="Rooms" active={route().current("rooms")} onClick={() => setIsSidebarOpen(false)} href={route("rooms")} />
                        </li>
                        <li>
                            <NavLink title="Containers" active={route().current("containers")} onClick={() => setIsSidebarOpen(false)} href={route("containers")} />
                        </li>
                        <li>
                            <NavLink title="Items" active={route().current("items")} href={route("items")} onClick={() => setIsSidebarOpen(false)} />
                        </li>
                        <li>
                            <NavLink title="Categories" active={route().current("categories")} onClick={() => setIsSidebarOpen(false)} href={route("categories")} />
                        </li>
                    </ul>

                    <ul className="space-y-2 font-medium border-t mt-4 border-gray-200 dark:border-gray-700">
                        <li className="pt-4">
                            <NavLink
                                title="Change Theme"
                                href=""
                                currentTheme={theme}
                                onClick={() => {
                                    SwitchTheme();
                                }}
                            />
                        </li>

                        <li>
                            <NavLink title="Settings" active={route().current("settings")} href={route("settings")} onClick={() => setIsSidebarOpen(false)} />
                        </li>

                        <li>
                            <NavLink title="Sign Out" href="" onClick={e => handleSignOut(e)} />
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
