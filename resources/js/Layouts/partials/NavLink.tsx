import { InertiaLinkProps, Link } from "@inertiajs/react";
import { ReactElement } from "react";
import DashboardIcon from "@/Components/Icons/DashboardIcon";
import RoomsIcon from "@/Components/Icons/RoomsIcon";
import ContainersIcon from "@/Components/Icons/ContainersIcon";
import ItemsIcon from "@/Components/Icons/ItemsIcon";
import CategoriesIcon from "@/Components/Icons/CategoriesIcon";
import SettingsIcon from "@/Components/Icons/SettingsIcon";
import SignOutIcon from "@/Components/Icons/SignOutIcon";
import MoonIcon from "@/Components/Icons/MoonIcon";
import SunIcon from "@/Components/Icons/SunIcon";
import { router } from "@inertiajs/react";

interface NavLinkProps extends InertiaLinkProps {
    title: "Dashboard" | "Rooms" | "Containers" | "Items" | "Categories" | "Settings" | "Change Theme" | "Sign Out";
    active?: boolean;
    currentTheme?: string;
}

const NavLink = ({ title, active = false, currentTheme, ...props }: NavLinkProps) => {
    let icon: ReactElement | undefined;

    const iconClasslist: string = `flex-shrink-0 w-[28px] h-[28px] text-gray-${active ? "900" : "500"} transition duration-[50ms] dark:${active ? "text-white" : "text-gray-400"} group-hover:text-gray-900 dark:group-hover:text-white`;

    switch (title.toLowerCase()) {
        case "dashboard":
            icon = <DashboardIcon className={iconClasslist} />;
            break;

        case "rooms":
            icon = <RoomsIcon className={iconClasslist} />;
            break;

        case "containers":
            icon = <ContainersIcon className={iconClasslist} />;
            break;

        case "items":
            icon = <ItemsIcon className={iconClasslist} />;
            break;

        case "categories":
            icon = <CategoriesIcon className={iconClasslist} />;
            break;

        case "settings":
            icon = <SettingsIcon className={iconClasslist} />;
            break;

        case "sign out":
            icon = <SignOutIcon className={iconClasslist + " ms-1"} />;
            break;
        case "change theme":
            icon = currentTheme === "dark" ? <MoonIcon className={iconClasslist} /> : <SunIcon className={iconClasslist} />;
            break;
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Run any additional onClick functions here
        if (props.onClick) {
            props.onClick(e);
        }
        // Use Inertia to navigate
        if (props.href !== "") {
            router.get(props.href);
        }
    };

    return (
        <Link {...props} onClick={handleClick} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-green-200 hover:bg dark:hover:bg-green-700 group ${active ? "bg-green-200 dark:bg-green-700" : ""}`}>
            {icon}
            <span className="ms-3">{title}</span>
        </Link>
    );
};

export default NavLink;
