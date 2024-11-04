import { ReactNode } from "react";
import Modal from "./Modal";
import CloseIcon from "../Icons/CloseIcon";

type FormModalProps = {
    isOpen: boolean;
    setIsOpen: (_value: boolean) => void;
    children: ReactNode;
    title?: string;
    size?: "normal" | "large";
};

const FormModal = ({ isOpen, setIsOpen, children, size, title }: FormModalProps) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} size={size}>
            <div className="relative bg-gray-100 rounded-lg shadow-xl dark:bg-gray-700">
                <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title ?? ""}</h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <CloseIcon className="h-3 w-3" />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {children}
            </div>
        </Modal>
    );
};

export default FormModal;
