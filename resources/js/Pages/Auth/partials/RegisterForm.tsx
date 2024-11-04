import InputError from "@/Components/Forms/Inputs/InputError";
import React from "react";
import AuthFormLabel from "./AuthFormLabel";
import AuthFormInput from "./AuthFormInput";
import { Link } from "@inertiajs/react";
import AuthFormSelect from "./AuthFormSelect";
import { User } from "@/types/User";

type RegisterFormProps = {
    data: User & {
        password_confirmation: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: (_key: "password_confirmation" | keyof User, _value: any) => void;
    onSubmit: () => void;
    isLoading: boolean;
    errors: { [key: string]: string } | null;
    recentlySuccessful: boolean;
} & React.FormHTMLAttributes<HTMLFormElement>;

const RegisterForm = ({ data, setData, isLoading, errors, onSubmit, recentlySuccessful, ...props }: RegisterFormProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form {...props} onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="mb-5 md:w-1/2">
                    <AuthFormLabel htmlFor="firstName">First Name</AuthFormLabel>
                    <AuthFormInput name="firstName" type="text" value={data.firstName} onChange={e => setData("firstName", e.target.value)} required={true} placeholder="Insert your first name" />
                    <InputError message={errors?.firstName} className="mt-2" />
                </div>

                <div className="mb-5 md:w-1/2">
                    <AuthFormLabel htmlFor="lastName">Last Name</AuthFormLabel>
                    <AuthFormInput name="lastName" type="text" value={data.lastName} onChange={e => setData("lastName", e.target.value)} required={true} placeholder="Insert your last name" />
                    <InputError message={errors?.lastName} className="mt-2" />
                </div>
            </div>

            <div className="mb-5">
                <AuthFormLabel htmlFor="country">Country</AuthFormLabel>
                <AuthFormSelect name="country" value={data.country} onChange={e => setData("country", e.target.value)} required={true} />
                <InputError message={errors?.country} className="mt-2" />
            </div>

            <div className="mb-5">
                <AuthFormLabel htmlFor="email">Email</AuthFormLabel>
                <AuthFormInput type="email" name="email" required={true} value={data.email} onChange={e => setData("email", e.target.value)} placeholder="your_email@mail.com" />
                <InputError message={errors?.email} className="mt-2" />
            </div>

            <div className="mb-5">
                <AuthFormLabel htmlFor="password">Password</AuthFormLabel>
                <AuthFormInput type="password" name="password" value={data.password} onChange={e => setData("password", e.target.value)} required={true} />
                <InputError message={errors?.password} className="mt-2" />
            </div>

            <div className="mb-5">
                <AuthFormLabel htmlFor="password_confirmation">Confirm Password</AuthFormLabel>
                <AuthFormInput name="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData("password_confirmation", e.target.value)} required={true} />
                <InputError message={errors?.password_confirmation} className="mt-2" />
            </div>
            <div className="mb-5">
                <Link href="/login" className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Already Registered? Sign In
                </Link>
            </div>
            <input
                type="submit"
                value={isLoading || (!isLoading && recentlySuccessful) ? "Please Wait" : "Register"}
                disabled={isLoading}
                className="px-4  w-full text-white py-2 font-bold bg-lime-600 rounded hover:bg-lime-500 btn btn-block btn-primary"
            />
        </form>
    );
};

export default RegisterForm;
