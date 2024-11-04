import ConfirmButton from "@/Components/Forms/buttons/ConfirmButton";
import FormInput from "@/Components/Forms/Inputs/FormInput";
import FormInputLabel from "@/Components/Forms/Inputs/FormInputLabel";
import InputError from "@/Components/Forms/Inputs/InputError";
import useApi from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { Category } from "@/types/Category";

type CategoryFormProps = { data?: Category | null; onSubmit: (_success: boolean) => void };

const CategoryForm = ({ data, onSubmit }: CategoryFormProps) => {
    const toast = useToast();

    const {
        data: categoryData,
        setData: setCategoryData,
        submit,
        isLoading,
        recentlySuccessful,
        errors
    } = useApi<Category>({
        id: data?.id || undefined,
        name: data?.name || ""
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(data ? route("categories.update") : route("categories.store"), data ? "PATCH" : "POST").then(response => {
            if (response.ok) {
                toast("success", data ? "Category has been successfully updated" : "Category has been successfully added");
                onSubmit(true);
            } else {
                toast("danger", "An error occurred while processing your request. Please try again.");
                onSubmit(false);
            }
        });
    };

    return (
        <form className="p-4 md:p-5" onSubmit={e => handleSubmit(e)}>
            <div className="mb-7">
                <FormInputLabel htmlFor="name">Category Name</FormInputLabel>
                <FormInput name="name" type="text" required className="!bg-gray-50 dark:!bg-gray-600" placeholder="Insert a name" value={categoryData?.name} onChange={e => setCategoryData("name", e.target.value)} />
                <InputError message={errors?.name} />
            </div>

            <ConfirmButton type="submit" className="flex items-center justify-center !px-4 text-sm" disabled={isLoading || recentlySuccessful}>
                {isLoading || recentlySuccessful ? "Saving..." : data ? "Update Category" : "Add Category"}
            </ConfirmButton>
        </form>
    );
};

export default CategoryForm;
