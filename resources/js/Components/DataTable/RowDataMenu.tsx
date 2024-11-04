import { useState, useRef, useEffect } from "react";
import EyeIcon from "../Icons/EyeIcon";
import EditIcon from "../Icons/EditIcon";
import TrashIcon from "../Icons/TrashIcon";

type RowDataMenuProps = {
    onClick?: (_e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
    onViewClick?: () => void;
    onDeleteClick?: () => void;
    onEditClick?: () => void;
};

const RowDataMenu = ({ onDeleteClick, onViewClick, onEditClick, onClick }: RowDataMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.textContent === "Delete" && onDeleteClick) {
            onDeleteClick();
        } else if (e.currentTarget.textContent === "Edit" && onEditClick) {
            onEditClick();
        } else if (e.currentTarget.textContent === "View" && onViewClick) {
            onViewClick();
        }
    };

    return (
        <div className="flex items-center justify-end relative">
            <button
                ref={buttonRef}
                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
                onClick={e => {
                    onClick?.(e);
                    toggleMenu();
                }}
            >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </button>
            {isOpen && (
                <div ref={menuRef} className="z-10 w-44 absolute right-0 top-full mt-2 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 min-w-max">
                    <ul className="text-sm flex flex-col text-gray-700 dark:text-gray-200 py-1">
                        {onViewClick && (
                            <li>
                                <button
                                    onClick={e => handleMenuClick(e)}
                                    className="flex w-full items-center text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-200 cursor-pointer py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-t"
                                >
                                    <EyeIcon />
                                    View
                                </button>
                            </li>
                        )}
                        {onEditClick && (
                            <li>
                                <button
                                    onClick={e => handleMenuClick(e)}
                                    className="flex w-full items-center text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-200 cursor-pointer py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <EditIcon />
                                    Edit
                                </button>
                            </li>
                        )}
                        {onDeleteClick && (
                            <li>
                                <button onClick={e => handleMenuClick(e)} className="flex w-full items-center bg-red-600 text-gray-50 cursor-pointer py-3 px-4 text-sm hover:bg-red-700 rounded-b">
                                   <TrashIcon />
                                    Delete
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RowDataMenu;
