import {InertiaLinkProps, Link, } from "@inertiajs/react";

type AppLogoProps = {
    classList?: string;
} & InertiaLinkProps;

const AppLogo = ({classList, ...props}: AppLogoProps) => {
    return (
        <Link {...props} className={`flex items-center mb-5 justify-center ${classList}`}>
            <img src="/img/homeo_logo.png" className="h-10 me-3 sm:h-11 block brightness-75" alt="Homeo Logo" />
        </Link>
    );
};

export default AppLogo;