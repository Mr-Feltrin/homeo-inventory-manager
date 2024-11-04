const WelcomeHero = () => {
    return (
        <>
            <section className="flex flex-col justify-center relative bg-cover bg-center h-screen">
                <img 
                    src="/img/hero_bg.jpg" 
                    srcSet="/img/hero_bg_mobile.png 640w, /img/hero_bg.jpg 1472w" 
                    sizes="(min-width: 1024px) 1472px, 640px" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950 z-10" style={{ top: "70%" }}></div>

                <div className="z-20 pt-24 lg:pt-32 pb-20 px-8 sm:px-0 md:pb-44 lg:flex lg:items-center gap-16 lg:justify-center mx-auto max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl">
                    <div className="text-center lg:text-left text-gray-800 mb-8">
                        <h1 className="text-gray-50 text-5xl xl:text-6xl 2xl:text-7xl font-extrabold mb-9 cursor-default">Organize Your Home Effortlessly with Homeo</h1>
                        <p className="text-gray-200 mb-10 lg:mb-12 lg:text-base 2xl:text-lg font-semibold cursor-default">
                            Manage your household items with this open source inventory solution, designed for anyone seeking better organization and control.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-normal items-center">
                            <a className="bg-green-600 px-6 xl:px-8 py-2.5 xl:py-4 font-semibold text-gray-100 rounded-sm cursor-pointer select-none" href={route("login")}>
                                Get Started
                            </a>
                            <a className="bg-gray-800 px-6 xl:px-8 py-2.5 xl:py-4 font-semibold text-gray-100 rounded-sm cursor-pointer select-none" href="https://github.com/Mr-Feltrin/homeo_inventory">
                                Check on Github
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full pointer-events-none">
                        <img 
                            className="flex-1" 
                            src="/img/laptop.png" 
                            srcSet="/img/laptop_mobile.png 640w, /img/laptop.png 1300w" 
                            sizes="(min-width: 1024px) 1300px, 640px" 
                            alt="Laptop Image" 
                            loading="eager" 
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default WelcomeHero;
