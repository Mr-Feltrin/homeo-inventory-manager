import { SVGProps } from "react";

const SunIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V2M12 22V21M21 12H22M2 12H3M18.5 5.5L20 4M4 20L5.5 18.5M4 4L5.5 5.5M18.5 18.5L20 20" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export default SunIcon;