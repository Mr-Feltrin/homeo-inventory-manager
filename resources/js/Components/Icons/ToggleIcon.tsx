import React, { SVGProps } from "react";

type ToggleIconProps = {
    toggleDirection?: "up" | "down";
} & SVGProps<SVGSVGElement>;

const ToggleIcon = ({ toggleDirection, ...props }: ToggleIconProps) => {
    return (
        <svg
            {...props}
            className={`w-6 h-6 tansition-transform duration-300 ease-in-out ${toggleDirection && toggleDirection === "up" ? "text-gray-600 dark:text-gray-100 rotate-180" : "text-gray-400 rotate-0"} ${props.className ?? ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
    );
};

export default ToggleIcon;
