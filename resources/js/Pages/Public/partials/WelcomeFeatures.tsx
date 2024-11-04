const WelcomeFeatures = () => {
    return (
        <section className="flex flex-col bg-gray-900 w-full pb-20 lg:pb-28 text-gray-100 py-12 pointer-events-none bg-gradient-to-b from-80% from-gray-900 to-gray-950">
            <div className="flex flex-col lg:flex-row flex-wrap items-center content-center justify-center gap-12 lg:gap-16 w-full px-8">
                <div className="max-w-64 lg:max-w-72">
                    <img
                        src="/img/phone_screen.png"
                        srcSet="/img/phone_screen_small.png 473w, /img/phone_screen.png 946w"
                        sizes="(min-width: 1024px) 946px, 473px"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col justify-center max-w-xl text-center lg:text-start">
                    <h2 className="font-extrabold text-4xl mb-6">Replicate your house layout and keep everything in place</h2>
                    <p className="text-gray-500 mb-6 text-lg font-bold">Be able to organize everything by creating Rooms and Containers. Describe each structure as you like, and manage your objects based on location.</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 w-full px-8 mt-16 lg:mt-24">
                <div className="max-w-md lg:order-2 lg:flex-shrink-0">
                    <img
                        src="/img/tablet_screen.png"
                        srcSet="/img/tablet_screen_small.png 640w, /img/tablet_screen.png 1892w"
                        sizes="(min-width: 1024px) 1892px, 640px"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col justify-center max-w-lg text-center lg:text-start">
                    <h2 className="font-extrabold text-4xl mb-6 lg:pt-5">Simple and User-Friendly Interface</h2>
                    <p className="text-gray-500 mb-6 text-lg font-bold">
                        Homeo is designed to be easy to use and intuitive. No need for a manual, just start adding your items and see how everything is organized in a snap.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WelcomeFeatures;
