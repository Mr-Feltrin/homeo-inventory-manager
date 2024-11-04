const WelcomeCallToAction = () => {
    return (
        <section className="bg-gray-950 pt-20 pb-56 bg-gradient-to-b from-[98%] from-gray-950 to-gray-800/60">
            <div className="flex flex-col items-center text-center px-8">
                <h2 className="text-gray-200 text-5xl lg:text-6xl font-bold">Ready to Take Control with Homeo?</h2>
                <p className="text-gray-200 mt-7 font-bold text-xl">Start organizing your household items today!</p>
                <a className="mt-9 bg-green-600 px-5 rounded-sm py-4 font-semibold text-lg text-gray-100 cursor-pointer select-none" href={route("register")}>Start using Homeo</a>
            </div>
        </section>
    );
};

export default WelcomeCallToAction;
