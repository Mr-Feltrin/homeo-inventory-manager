import { useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import styles from "./Register.module.css";
import RegisterForm from "./partials/RegisterForm";
import useUserLocation from "@/hooks/useUserLocation";
import useApi from "@/hooks/useApi";
import { User } from "@/types/User";
export default function Register() {
    const location = useUserLocation();

    const { data, setData, submit, isLoading, errors, recentlySuccessful } = useApi<User & { password_confirmation: string }>({
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleSubmit = () => {
        submit(route("register"), "POST").then(response => {
            if (response.ok) {
                router.visit(route("dashboard"));
            }
        });
    };

    useEffect(() => {
        if (location) {
            setData("country", location);
        }
    }, [location]);

    return (
        <>
            <Head title="Sign up" />
            <div className={`relative flex flex-col h-screen items-center justify-center ${styles.register_background}`}>
                <div className="relative w-full max-w-lg p-8 bg-white rounded-lg overflow-auto max-h-[43.75rem] md:max-h-none">
                    <h2 className="mb-2 font-bold text-3xl text-gray-700">Sign up to Homeo</h2>
                    <p className="mb-7 text-gray-400">Join Homeo, manage your household inventory efficiently and keep track of what matters</p>
                    <RegisterForm data={data!} setData={setData} isLoading={isLoading} errors={errors} onSubmit={handleSubmit} recentlySuccessful={recentlySuccessful} />
                </div>
            </div>
        </>
    );
}
