import { SVGProps } from "react";

const HomeoIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg {...props} className={props.className ?? "w-10 h-10 text-gray-500 dark:text-gray-400"} xmlns="http://www.w3.org/2000/svg" width="336" height="285" viewBox="0 0 336 285" version="1.1">
            <path
                d="M 50.667 1.667 C 50.300 2.033, 50 20.192, 50 42.020 L 50 81.706 26.023 96.985 C 12.835 105.389, 2.287 112.655, 2.582 113.133 C 2.877 113.610, 19.714 114, 39.999 114 L 76.879 114 77.190 117.750 L 77.500 121.500 102.750 121.767 L 128 122.034 128 108.517 L 128 95 147.750 81.878 L 167.500 68.755 171.084 70.812 C 173.056 71.943, 182.393 77.921, 191.834 84.095 L 209 95.321 209 108.660 L 209 122 234 122 L 259 122 259 118.012 L 259 114.024 296.750 113.762 C 321.212 113.592, 334.443 113.148, 334.338 112.500 C 334.204 111.668, 303.862 92.161, 194.708 22.729 C 189.322 19.303, 181.047 13.964, 176.319 10.865 L 167.722 5.230 154.111 14.077 C 146.625 18.943, 137.575 24.759, 134 27.002 C 130.425 29.245, 120.975 35.330, 113 40.524 L 98.500 49.969 98.233 25.484 L 97.965 1 74.649 1 C 61.825 1, 51.033 1.300, 50.667 1.667 M 77.460 130.250 C 77.198 130.938, 77.099 165.700, 77.241 207.500 L 77.500 283.500 102.750 283.767 L 128 284.034 128 243.517 L 128 203 167.989 203 L 207.978 203 208.239 243.750 L 208.500 284.500 233.500 284.500 L 258.500 284.500 258.756 206.750 L 259.012 129 233.506 129 L 208 129 208 143.500 L 208 158 168 158 L 128 158 128 143.500 L 128 129 102.969 129 C 83.865 129, 77.824 129.296, 77.460 130.250"
                stroke="none"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export default HomeoIcon;