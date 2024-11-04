import { useState, useEffect } from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

    // Change the theme
    const SwitchTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        }
        else {
            setTheme("dark");
        }
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add(theme);
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme === "dark" ? "dark" : "light");
    }, [theme]);

    return { theme, SwitchTheme };
};
