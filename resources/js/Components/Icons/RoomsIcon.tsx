import { SVGProps } from "react";

const RoomsIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g xmlns="http://www.w3.org/2000/svg" strokeWidth="0" />
            <g xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" />
            <g xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2H16C17.6569 2 19 3.34315 19 5V19C19 19.5523 18.5523 20 18 20H15" stroke="currentcolor" strokeWidth="2.04" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 2L12.5883 3.51767C13.9906 3.79812 15 5.02937 15 6.45941V20.7802C15 21.4112 14.4227 21.8845 13.8039 21.7608L6.60777 20.3216C5.67292 20.1346 5 19.3138 5 18.3604V2Z" stroke="currentcolor" strokeWidth="2.04" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12V14" stroke="currentcolor" strokeWidth="2.04" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
};

export default RoomsIcon;