import { useState } from "react";

type Step = { step: string; breadcrumb?: string; [key: string]: unknown };

// Custom hook to manage steps with history and breadcrumbs
const useSteps = <T extends Step>(initialStep: T) => {
    // State to keep track of the current step
    const [step, setStep] = useState<T>(initialStep);
    // State to keep track of the history of steps
    const [history, setHistory] = useState<T[]>([]);

    // Function to update the current step and add the previous step to history
    const updateStep = (newStep: T) => {
        setHistory(prevHistory => [...prevHistory, step]);
        setStep(newStep);
    };

    // Function to handle breadcrumb click and revert to a specific step in history
    const handleBreadcrumbClick = (index: number) => {
        const newHistory = history.slice(0, index);
        setStep(history[index]);
        setHistory(newHistory);
    };

    // Function to change the current step without adding to history
    const setCurrentStep = (newStep: T) => {
        setStep(newStep);
    };

    // Function to generate breadcrumbs from the history of steps
    const generateBreadcrumbs = () => {
        return history.map((step, index) => ({
            title: step.breadcrumb || "",
            onClick: () => handleBreadcrumbClick(index)
        }));
    };

    return { step, updateStep, setCurrentStep, generateBreadcrumbs };
};

export default useSteps;
