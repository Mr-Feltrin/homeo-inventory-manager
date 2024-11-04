import EmailIcon from "@/Components/Icons/EmailIcon";
import GithubIcon from "@/Components/Icons/GithubIcon";
import LinkedinIcon from "@/Components/Icons/LinkedinIcon";
import WebsiteIcon from "@/Components/Icons/WebsiteIcon";

const WelcomeFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 bg-gray-800/60">
            <div className="flex flex-wrap justify-center px-8">
                <div className="flex justify-between flex-1 max-w-6xl gap-8">
                    <p className="text-sm sm:text-base text-gray-200 ">Homeo Inventory Management ©{currentYear}, All rights reserved | Developed by Rafael Feltrin</p>
                    <div className="flex items-center content-center text-gray-100 gap-4">
                        <a href="https://feltrindev.com">
                            <WebsiteIcon className="w-5 h-[18px]" />
                        </a>
                        <a href="https://github.com/Mr-Feltrin">
                            <GithubIcon className="h-5 w-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/rafael-feltrin/">
                            <LinkedinIcon className="w-4 h-5" />
                        </a>
                        <a href="mailto:rasouza1@hotmail.com">
                            <EmailIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default WelcomeFooter;
