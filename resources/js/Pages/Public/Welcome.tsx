import WelcomeHero from "./partials/WelcomeHero";
import WelcomeCallToAction from "./partials/WelcomeCallToAction";
import WelcomeFeatures from "./partials/WelcomeFeatures";
import WelcomeFooter from "./partials/WelcomeFooter";
import WelcomeHeadline from "./partials/WelcomeHeadline";

const Welcome = () => {
    return (
        <main className="bg-gray-950">
            <WelcomeHero />
            <WelcomeHeadline />
            <WelcomeFeatures />
            <WelcomeCallToAction />
            <WelcomeFooter />
        </main>
    );
};

export default Welcome;
