import React, { createContext, useReducer, Dispatch, ReactNode } from "react";

type Toast = {
    id: number;
    type: string;
    message: string;
};

type ToastAction = { type: "ADD_TOAST"; payload: Toast } | { type: "REMOVE_TOAST"; payload: number };

export const ToastContext = createContext<{ toasts: Toast[]; dispatch: Dispatch<ToastAction> }>({ toasts: [], dispatch: () => {} });
 
const toastReducer = (state: Toast[], action: ToastAction) => {
    switch (action.type) {
        case "ADD_TOAST":
            return [...state, action.payload];
        case "REMOVE_TOAST":
            return state.filter(toast => toast.id !== action.payload);
        default:
            return state;
    }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(toastReducer, []);

    return <ToastContext.Provider value={{ toasts: state, dispatch }}>{children}</ToastContext.Provider>;
};
