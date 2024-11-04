import React, { forwardRef, InputHTMLAttributes } from "react";

type FormTextareaProps = {
    name: InputHTMLAttributes<HTMLTextAreaElement>["name"];
    className?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ name, className, ...props }, ref) => {
    return (
        <textarea
            rows={2}
            ref={ref}
            name={name}
            id={name}
            className={`shadow border min-h-11 sm:min-h-[42px] sm:pt-2.5 resize-y border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full  bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-300 dark:text-white focus:ring-gray-400 focus:border-gray-400 dark:focus:border-gray-300 dark:focus:ring-gray-300 appearance-none focus:outline-none  ${className}`}
            {...props}
        ></textarea>
    );
});

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
