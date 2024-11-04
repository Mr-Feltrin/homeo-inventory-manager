import CancelButton from "../Forms/buttons/CancelButton";
import DangerButton from "../Forms/buttons/DangerButton";
import CloseIcon from "../Icons/CloseIcon";
import Modal from "./Modal";

type DialogModalProps = {
    isOpen: boolean;
    setIsOpen: (_value: boolean) => void;
    prompt: string;
    onConfirm: () => void;
};

const DialogModal = ({ isOpen, setIsOpen, prompt, onConfirm }: DialogModalProps) => {
    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        onConfirm();
        handleCancel();
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                    type="button"
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="popup-modal"
                    onClick={handleCancel}
                >
                    <CloseIcon />
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-600 dark:text-gray-400">{prompt}</h3>
                    <DangerButton onClick={handleConfirm}>Yes, i'm sure</DangerButton>

                    <CancelButton className="ms-3" onClick={handleCancel}>
                        No, cancel
                    </CancelButton>
                </div>
            </div>
        </Modal>
    );
};

export default DialogModal;
