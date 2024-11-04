import React, { useContext, useEffect, useState } from "react";
import { ToastContext } from "@/Contexts/ToastContext";
import Toast from "./Toast";

const ToastContainer = () => {
    const { toasts } = useContext(ToastContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    let maxToasts;
    if (windowWidth < 640) {
        // xs
        maxToasts = 1;
    } else if (windowWidth >= 640 && windowWidth < 768) {
        // sm
        maxToasts = 2;
    } else if (windowWidth >= 768 && windowWidth < 1024) {
        // md
        maxToasts = 3;
    } else if (windowWidth >= 1024 && windowWidth < 1280) {
        // lg
        maxToasts = 4;
    } else {
        // xl
        maxToasts = 5;
    }

    return (
        <div className="fixed top-0 right-0 mx-6 mt-6 space-y-4 z-[999]">
            {[...toasts]
                .slice(-maxToasts)
                .reverse()
                .map(toast => (
                    <Toast key={toast.id} {...toast} />
                ))}
        </div>
    );
};

export default ToastContainer;
