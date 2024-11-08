import { SVGProps } from "react";

const SignOutIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g xmlns="http://www.w3.org/2000/svg" strokeWidth="0" />
            <g xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" />
            <g xmlns="http://www.w3.org/2000/svg">
                <path d="M13 12H22M22 12L18.6667 8M22 12L18.6667 16" stroke="currentcolor" strokeWidth="2.088" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 7V5.1736C14 4.00352 12.9999 3.08334 11.8339 3.18051L3.83391 3.84717C2.79732 3.93356 2 4.80009 2 5.84027V18.1597C2 19.1999 2.79733 20.0664 3.83391 20.1528L11.8339 20.8195C12.9999 20.9167 14 19.9965 14 18.8264V17" stroke="currentcolor" strokeWidth="2.088" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
};

export default SignOutIcon;