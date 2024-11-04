export type Change = {
    previousValue?: string | number | boolean | object;
    newValue?: string | number | boolean | object;
    previousModelName?: string;
    previousModelType?: string;
    newModelName?: string;
    newModelType?: string;
    previousModelActive?: boolean;
    newModelActive?: boolean;
};

export type Activity = {
    current_model_type: string;
    current_model_active: boolean;
    current_model_id: number;
    current_model_name: string;
    action: string;
    changes: { [key: string]: Change } | null;
    created_at: string;
};

