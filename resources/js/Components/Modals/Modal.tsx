import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean;
    className?: string;
    setIsOpen: (_value: boolean) => void;
    size?: "normal" | "large";
    children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Modal = ({ isOpen, setIsOpen, className, children, size, ...props }: ModalProps) => {
    const [opacity, setOpacity] = useState<number>(0);
    const [shouldRender, setShouldRender] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const modalRootRef = useRef<HTMLDivElement | null>(null);

    // Handles the click on the outside area of the modal so it closes
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    // Creates the portal root for the modal when it's opened, and manage the modal's display effects
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isOpen) {
            if (!modalRootRef.current) {
                modalRootRef.current = document.createElement("div");
                modalRootRef.current.setAttribute("id", "modal-root");
                document.body.appendChild(modalRootRef.current);
            }
            setShouldRender(true);
            // Small delay for opacity effect after component render
            timer = setTimeout(() => setOpacity(1), 10);
            document.body.classList.add("overflow-hidden");
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            setOpacity(0);
            document.body.classList.remove("overflow-hidden");
            document.removeEventListener("mousedown", handleClickOutside);

            timer = setTimeout(() => {
                setShouldRender(false);
                if (modalRootRef.current && modalRootRef.current.parentNode) {
                    modalRootRef.current.parentNode.removeChild(modalRootRef.current);
                    modalRootRef.current = null;
                }
            }, 200);
        }
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return shouldRender && modalRootRef.current
        ? createPortal(
              <div
                  {...props}
                  tabIndex={-1}
                  className={`overflow-y-auto overflow-x-hidden h-screen fixed top-0 bg-[#00000080] right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full flex backdrop-filter backdrop-blur-sm transition-all duration-200 ease-linear ${className ? className : ""} ${opacity === 0 ? "opacity-0" : "opacity-100"}`}
                  aria-modal="true"
                  role="dialog"
              >
                  <div ref={modalRef} className={`relative p-4 w-full ${size === "large" ? "max-w-3xl" : "max-w-xl"} max-h-full overflow-auto`}>
                      {children}
                  </div>
              </div>,
              document.getElementById("modal-root") as Element
          )
        : null;
};

export default Modal;
