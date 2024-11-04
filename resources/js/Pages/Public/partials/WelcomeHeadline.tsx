const WelcomeHeadline = () => {
    return (
        <section className="flex flex-col items-center pt-24 pb-16 lg:pb-28 text-gray-100 mx-auto pointer-events-none bg-gradient-to-b from-80% from-gray-950 to-gray-900">
            <div className="flex flex-wrap items-center justify-center text-center max-w-5xl px-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-50 mb-8">Master Your Home: Know What You Own and Where It's Stored</h2>
                <p className="max-w-3xl px-8 text-gray-300 font-bold">Tired of searching for things around the house? With Homeo, take control of your belongings and always know where everything is stored.</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-baseline gap-14 lg:gap-12 xl:gap-20 justify-center mt-24 px-10">
                <div className="flex flex-col items-center gap-2 text-center max-w-xl lg:max-w-72">
                    <img className="max-w-56" src="/img/stacked_boxes.png" loading="lazy" />
                    <h4 className="font-extrabold text-2xl">Seamless Organization</h4>
                    <p className="text-gray-400">Easily catalog and find your belongings, making home organization a breeze</p>
                </div>

                <div className="flex flex-col items-center gap-2 text-center max-w-xl lg:max-w-72">
                    <img className="max-w-60" src="/img/open_source.png" loading="lazy" />
                    <h4 className="font-extrabold text-2xl">Open Source & Free</h4>
                    <p className="text-gray-400">Benefit from community-driven development and customization without any cost</p>
                </div>

                <div className="flex flex-col items-center gap-2 text-center max-w-xl lg:max-w-72">
                    <img className="max-w-40" src="/img/checklist.png" loading="lazy" />
                    <h4 className="font-extrabold text-2xl">Inventory Tracking</h4>
                    <p className="text-gray-400">Keep track of item quantities to avoid over-purchasing and waste</p>
                </div>
            </div>
        </section>
    );
};

export default WelcomeHeadline;
