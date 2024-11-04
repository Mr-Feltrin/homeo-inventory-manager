import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import InputError from "@/Components/Forms/Inputs/InputError";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";

const UpdatePasswordForm = () => {
    const { data, setData, errors, patch, reset, processing, recentlySuccessful } = useForm({
        current_password: "",
        password: "",
        password_confirmation: ""
    });

    const [buttonText, setButtonText] = useState("Save");
    const [disableButton, setDisableButton] = useState(false);

    useEffect(() => {
        if (processing) {
            setButtonText("Saving...");
            setDisableButton(true);
        } else if (recentlySuccessful) {
            setButtonText("Saved!");
            setDisableButton(true);

            setTimeout(() => {
                setButtonText("Save");
                setDisableButton(false);
            }, 2500);

        } else {
            setButtonText("Save");
            setDisableButton(false);
        }
    }, [processing, recentlySuccessful]);

    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        patch(route("password.update"), { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <FormInputLabel htmlFor="current_password">Current Password</FormInputLabel>
            <FormInput type="password" name="current_password" required={true} value={data.current_password} onChange={e => setData("current_password", e.target.value)} />
            <InputError className="mt-2" message={errors.current_password} />

            <FormInputLabel htmlFor="password" className="mt-6">
                New Password
            </FormInputLabel>
            <FormInput type="password" name="password" required={true} value={data.password} onChange={e => setData("password", e.target.value)} />
            <InputError className="mt-2" message={errors.password} />

            <FormInputLabel htmlFor="password_confirmation" className="mt-6">
                Confirm Password
            </FormInputLabel>
            <FormInput type="password" name="password_confirmation"required={true} value={data.password_confirmation} onChange={e => setData("password_confirmation", e.target.value)} />
            <InputError className="mt-2" message={errors.password_confirmation} />

            <ConfirmButton type="submit" className="mt-6" disabled={disableButton}>
                {buttonText}
            </ConfirmButton>
        </form>
    );
};

export default UpdatePasswordForm;
