import { SVGProps } from "react";

const DashboardIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <rect xmlns="http://www.w3.org/2000/svg" x="3" y="3" width="7" height="7" rx="1" stroke="currentcolor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect xmlns="http://www.w3.org/2000/svg" x="3" y="14" width="7" height="7" rx="1" stroke="currentcolor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect xmlns="http://www.w3.org/2000/svg" x="14" y="3" width="7" height="7" rx="1" stroke="currentcolor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect xmlns="http://www.w3.org/2000/svg" x="14" y="14" width="7" height="7" rx="1" stroke="currentcolor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default DashboardIcon;