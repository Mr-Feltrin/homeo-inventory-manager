// useUserLocation.ts
import { useState, useEffect } from "react";
import axios from "axios";

type UserLocationProps = {
    country_name: string;
};

const useUserLocation = (): string | null => {
    const [location, setLocation] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get<UserLocationProps>("https://ipapi.co/json/");
                setLocation(response.data.country_name);
            } catch {
                setLocation(null);
            }
        };

        fetchLocation();
    }, []);

    return location;
};

export default useUserLocation;
