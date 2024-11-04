import { Head } from "@inertiajs/react";
import ContentArea from "@/Components/Content/ContentArea";
import UpdateUserForm from "./partials/UpdateUserForm";
import ContentTitle from "@/Components/Content/ContentTitle";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";

const Settings = () => {
    return (
        <>
            <Head title="Settings" />
            <ContentArea>
                <ContentTitle title="Profile Information" />
                <div className="px-4 pb-4 md:px-8 md:pb-8">
                    <UpdateUserForm />
                </div>
            </ContentArea>

            <ContentArea className="pb-5">
                <ContentTitle title="Change Password" />
                <div className="px-4 pb-4 md:px-8 md:pb-8">
                    <UpdatePasswordForm />
                </div>
            </ContentArea>
        </>
    );
};

export default Settings;
