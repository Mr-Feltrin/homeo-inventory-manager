import styles from "./Login.module.css";
import InputError from "@/Components/Forms/Inputs/InputError";
import { Head, Link, router } from "@inertiajs/react";
import AuthFormLabel from "./partials/AuthFormLabel";
import AuthFormInput from "./partials/AuthFormInput";
import useApi from "@/hooks/useApi";

type LoginProps = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { submit, isLoading, data, setData, errors, recentlySuccessful } = useApi<LoginProps>({
        email: "",
        password: "",
        remember: false
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(route("login"), "POST").then(response => {
            if (response.ok) {
                router.get(route("dashboard"), {}, { replace: true });
            }
        });
    };

    return (
        <>
            <Head title="Sign in" />

            <div className="flex flex-col md:flex-row h-screen bg-gray-200">
                <div className={`hidden md:block md:w-1/2 ${styles.login_bg_image}`}>
                    <img src="/img/homeo_logo.png" alt="Logo" className={styles.logo_image} />
                </div>
                <div className="w-full h-screen md:w-1/2 flex md:justify-center items-center px-8 bg-gray-50">
                    <div className="w-full max-w-md mx-auto md:my-auto p-8">
                        <h2 className="mb-2 font-bold text-3xl text-gray-700">Sign in to Homeo</h2>
                        <p className="mb-12 text-gray-400">Get access to Homeo, and keep track of your personal belongings</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <AuthFormLabel htmlFor="email">Email</AuthFormLabel>
                                <AuthFormInput
                                    className="h-[3.375rem]"
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="Insert your Email"
                                    value={data!.email}
                                    onChange={e => setData("email", e.target.value)}
                                    required={true}
                                />
                                <InputError message={errors?.email} className="mt-2" />
                            </div>
                            <div className="mb-5">
                                <AuthFormLabel htmlFor="password">Password</AuthFormLabel>
                                <AuthFormInput
                                    type="password"
                                    name="password"
                                    className="h-[3.375rem]"
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    value={data!.password}
                                    onChange={e => setData("password", e.target.value)}
                                    required={true}
                                />
                                <InputError message={errors?.password} className="mt-2" />
                            </div>
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center">
                                    <input name="remember" checked={data!.remember} onChange={e => setData("remember", e.target.checked)} className="mr-2 leading-tight" type="checkbox" id="stay-logged-in" />
                                    <label className="text-sm text-gray-700" htmlFor="stay-logged-in">
                                        Remember me
                                    </label>
                                </div>
                                <Link href={route("register")} className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Create an Account
                                </Link>
                            </div>
                            <input
                                type="submit"
                                value={isLoading || (!isLoading && recentlySuccessful) ? "Please Wait" : "Log In"}
                                disabled={isLoading}
                                className="px-4  w-full text-white py-2 font-bold bg-lime-600 rounded hover:bg-lime-500 btn btn-block btn-primary"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
