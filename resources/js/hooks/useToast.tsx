import { useContext, useCallback } from "react";
import { ToastContext } from "@/Contexts/ToastContext";

type ToastType = "success" | "danger" | "warning";

export const useToast = () => {
    const { dispatch } = useContext(ToastContext);

    const showToast = useCallback(
        (type: ToastType, message: string) => {
            dispatch({
                type: "ADD_TOAST",
                payload: { id: Date.now(), type, message }
            });
        },
        [dispatch]
    );

    return showToast;
};
