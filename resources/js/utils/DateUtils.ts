// Helper function to check if value is a date
export const isDate = (value: unknown): boolean => {
    if (typeof value !== "string") {
        return false;
    }

    // Date formats that can be parsed
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const usDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const brDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!iso8601Regex.test(value) && !dateRegex.test(value) && !usDateRegex.test(value) && !brDateRegex.test(value)) {
        return false;
    }

    // Parse the value as a date
    const date = new Date(value);
    return !isNaN(date.getTime());
};

// Helper function to format date
export const formatDate = (date: string): string => {
    return new Date(date).toLocaleString(navigator.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};
