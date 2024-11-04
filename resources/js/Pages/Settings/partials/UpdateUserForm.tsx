import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import InputError from "@/Components/Forms/Inputs/InputError";
import SelectCountry from "@/Components/Forms/Inputs/SelectCountry";
import React, { useState, useEffect, FormHTMLAttributes, FormEventHandler } from "react";
import { PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";

const UpdateUserForm = ({ ...props }: FormHTMLAttributes<HTMLFormElement>) => {
    const [buttonText, setButtonText] = useState("Update");
    const [disableButton, setDisableButton] = useState(false);

    const user = usePage<PageProps>().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        email: user.email
    });

    useEffect(() => {
        if (processing) {
            setButtonText("Updating...");
            setDisableButton(true);
        } else if (recentlySuccessful) {
            setButtonText("Updated!");
            setDisableButton(true);

            setTimeout(() => {
                setButtonText("Update");
                setDisableButton(false);
            }, 2500);
        } else {
            setButtonText("Update");
            setDisableButton(false);
        }
    }, [processing, recentlySuccessful]);

    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        patch(route("profile.update"), { preserveScroll: true });
    };

    return (
        <form {...props} onSubmit={e => handleSubmit(e)}>
            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <FormInputLabel htmlFor="first-name">First Name</FormInputLabel>
                    <FormInput name="first-name" type="text" value={data.firstName} onChange={e => setData("firstName", e.target.value)} />
                    <InputError className="mt-2" message={errors.firstName} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <FormInputLabel htmlFor="last-name">Last Name</FormInputLabel>
                    <FormInput name="last-name" type="text" value={data.lastName} onChange={e => setData("lastName", e.target.value)} />
                    <InputError className="mt-2" message={errors.lastName} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <FormInputLabel htmlFor="email">Email</FormInputLabel>
                    <FormInput name="email" type="email" value={data.email} onChange={e => setData("email", e.target.value)} />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Country
                    </label>
                    <SelectCountry name="country" value={data.country} onChange={e => setData("country", e.target.value)} />
                    <InputError className="mt-2" message={errors.country} />
                </div>
                <div className="col-span-6 sm:col-full">
                    <ConfirmButton type="submit" disabled={disableButton}>
                        {buttonText}
                    </ConfirmButton>
                </div>
            </div>
        </form>
    );
};

export default UpdateUserForm;
