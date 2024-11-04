import EditIcon from "@/Components/Icons/EditIcon";
import EyeIcon from "@/Components/Icons/EyeIcon";
import TrashIcon from "@/Components/Icons/TrashIcon";
import { forwardRef } from "react";

type CardMenuProps = {
    cardMenuHidden: boolean;
    setCardMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
    handleView: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
};

const CardMenu = forwardRef<HTMLDivElement, CardMenuProps>(({ cardMenuHidden, setCardMenuHidden, handleView, handleEdit, handleDelete }, ref) => (
    <div ref={ref} className="absolute right-0 mt-10 w-48 py-2 bg-gray-50 rounded-md shadow-xl dark:bg-gray-700 z-50" hidden={cardMenuHidden}>
        <button
            onClick={() => {
                handleView();
                setCardMenuHidden(true);
            }}
            className="flex items-center w-full rounded-lg text-gray-900 dark:text-white px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-500"
        >
            <EyeIcon className="w-5 h-5 me-3" />
            View Room
        </button>
        <button
            className="flex items-center w-full rounded-lg px-3 py-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500"
            onClick={() => {
                handleEdit();
                setCardMenuHidden(true);
            }}
        >
            <EditIcon className="h-5 w-5 me-3" />
            Edit
        </button>
        <button
            onClick={() => {
                handleDelete();
                setCardMenuHidden(true);
            }}
            className="flex w-full items-center px-3 py-2 text-gray-900 bg-red-600 rounded-lg dark:text-white hover:bg-red-500"
        >
           <TrashIcon className="w-5 h-5 me-3" />
            Delete
        </button>
    </div>
));

CardMenu.displayName = "CardMenu";

export default CardMenu;
